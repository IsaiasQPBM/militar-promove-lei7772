
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calcularProximaDataQuadroAcesso, verificarPeriodoQuadroAcesso } from "@/services/promocaoService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar,
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CalendarRange, 
  Award,
  ListChecks,
  FileBarChart
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [resumoData, setResumoData] = useState({
    totalMilitares: 0,
    militaresElegiveis: 0,
    proximaDataQuadroAcesso: null as Date | null,
    isPeriodoQuadroAcesso: false,
    vagasTotais: 0,
    vagasPreenchidas: 0,
    alertasPendentes: 0
  });
  
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        // Obter dados de militares
        const { data: militaresData, error: militaresError } = await supabase
          .from("militares")
          .select("id, posto, quadro, dataultimapromocao, situacao");
        
        if (militaresError) throw militaresError;

        // Calcular total de militares ativos
        const militaresAtivos = militaresData.filter(m => m.situacao === "ativo");
        const totalMilitares = militaresAtivos.length;
        
        // Calcular militares elegíveis para promoção
        const hoje = new Date();
        const elegiveis = militaresAtivos.filter(militar => {
          if (!militar.dataultimapromocao) return false;
          
          const dataUltimaPromocao = new Date(militar.dataultimapromocao);
          const diferencaMeses = (hoje.getFullYear() - dataUltimaPromocao.getFullYear()) * 12 + 
                                hoje.getMonth() - dataUltimaPromocao.getMonth();
          
          // Verificar tempo mínimo de acordo com o posto
          const temposMinimos: Record<string, number> = {
            "Coronel": 0, 
            "Tenente-Coronel": 36,
            "Major": 48,
            "Capitão": 48,
            "1º Tenente": 48,
            "2º Tenente": 36,
            "Subtenente": 0,
            "1º Sargento": 36,
            "2º Sargento": 48,
            "3º Sargento": 48,
            "Cabo": 36,
            "Soldado": 24,
          };
          
          if (temposMinimos[militar.posto] !== undefined && 
              diferencaMeses >= temposMinimos[militar.posto] && 
              militar.posto !== "Coronel" && 
              militar.posto !== "Subtenente") {
            return true;
          }
          
          return false;
        });
        
        // Calcular vagas
        let vagasTotais = 0;
        let vagasPreenchidas = 0;
        
        // Simplificação: estimar vagas com base nos dados existentes
        // Na implementação real, isso viria da tabela de quadro de fixação de vagas
        const quadrosPrincipais = ["QOEM", "QPBM"];
        
        quadrosPrincipais.forEach(quadro => {
          // Estimar vagas totais e preenchidas por quadro
          const militaresNoQuadro = militaresAtivos.filter(m => m.quadro === quadro);
          const vagasEstimadasQuadro = quadro === "QOEM" ? 50 : 150; // Valores ilustrativos
          
          vagasTotais += vagasEstimadasQuadro;
          vagasPreenchidas += militaresNoQuadro.length;
        });
        
        // Calcular próxima data de inserção no quadro de acesso
        const proximaData = calcularProximaDataQuadroAcesso();
        
        // Verificar se estamos no período de inserção no quadro de acesso
        const emPeriodo = verificarPeriodoQuadroAcesso();
        
        // Alertas pendentes (simulação)
        const alertasPendentes = Math.min(elegiveis.length, 5);
        
        // Atualizar estado com todos os dados coletados
        setResumoData({
          totalMilitares,
          militaresElegiveis: elegiveis.length,
          proximaDataQuadroAcesso: proximaData,
          isPeriodoQuadroAcesso: emPeriodo,
          vagasTotais,
          vagasPreenchidas,
          alertasPendentes
        });
        
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarDados();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Painel de Controle</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Bem-vindo ao Sistema de Promoções do Corpo de Bombeiros Militar do Estado do Piauí (SysProm)
        </p>
      </div>
      
      {/* Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-t-4 ${resumoData.isPeriodoQuadroAcesso ? "border-t-green-500" : "border-t-amber-500"}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status do Quadro de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            {resumoData.isPeriodoQuadroAcesso ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Período de inclusão ativo</p>
                  <p className="text-xs text-gray-500">Quadro aberto para inclusões</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Próxima abertura</p>
                  <p className="text-xs text-gray-500">
                    {resumoData.proximaDataQuadroAcesso && 
                      format(resumoData.proximaDataQuadroAcesso, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-3 pt-2 border-t border-gray-100">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-cbmepi-purple"
                onClick={() => navigate("/gestao-promocoes")}
              >
                Ver quadro de acesso
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Militares Elegíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">{resumoData.militaresElegiveis} militares</p>
                <p className="text-xs text-gray-500">Prontos para promoção</p>
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-100">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-cbmepi-purple"
                onClick={() => navigate("/gestao-promocoes")}
              >
                Ver militares elegíveis
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Próximas Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Datas importantes</p>
                <div className="text-xs space-y-1 mt-1">
                  <p className="text-gray-500 flex items-center gap-1">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    18 de Julho - Promoções Semestrais
                  </p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    23 de Dezembro - Promoções Anuais
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-100">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-cbmepi-purple"
                onClick={() => navigate("/legislacao")}
              >
                Ver mais informações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resumo do Efetivo e Vagas */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white py-2 md:py-4">
          <CardTitle className="text-base md:text-lg">RESUMO DO EFETIVO</CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-200">
            Status de vagas e promoções
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">Total de Militares</h3>
                <Badge variant="outline">{resumoData.totalMilitares}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>Efetivo ativo do CBMEPI</span>
              </div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-cbmepi-purple mt-2" 
                onClick={() => navigate("/oficiais/estado-maior")}
              >
                Ver detalhes
              </Button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">Vagas Disponíveis</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {resumoData.vagasTotais - resumoData.vagasPreenchidas} vagas
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarRange className="h-4 w-4" />
                <span>
                  {Math.round((resumoData.vagasPreenchidas / resumoData.vagasTotais) * 100)}% de ocupação
                </span>
              </div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-cbmepi-purple mt-2" 
                onClick={() => navigate("/fixacao-vagas")}
              >
                Ver quadro de vagas
              </Button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">Alertas do Sistema</h3>
                <Badge variant={resumoData.alertasPendentes > 0 ? "default" : "outline"}>
                  {resumoData.alertasPendentes}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {resumoData.alertasPendentes > 0 ? 
                    `${resumoData.alertasPendentes} ${resumoData.alertasPendentes === 1 ? 'alerta' : 'alertas'} pendente${resumoData.alertasPendentes === 1 ? '' : 's'}` : 
                    "Nenhum alerta pendente"}
                </span>
              </div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-cbmepi-purple mt-2" 
                onClick={() => {}}
              >
                Ver todos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Acesso Rápido */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white py-2 md:py-4">
          <CardTitle className="text-base md:text-lg">ACESSO RÁPIDO</CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-200">Funcionalidades do Sistema</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/gestao-promocoes")}
          >
            <Award className="h-5 w-5 text-cbmepi-purple" />
            <div>
              <p className="text-sm font-medium">Gestão de Promoções</p>
              <p className="text-xs text-gray-500">Acompanhar elegibilidade</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/fixacao-vagas")}
          >
            <ListChecks className="h-5 w-5 text-cbmepi-purple" />
            <div>
              <p className="text-sm font-medium">Quadro de Fixação</p>
              <p className="text-xs text-gray-500">Gerenciar vagas</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/cadastro-militar")}
          >
            <Users className="h-5 w-5 text-cbmepi-purple" />
            <div>
              <p className="text-sm font-medium">Cadastrar Militar</p>
              <p className="text-xs text-gray-500">Adicionar novo militar</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 text-center"
            onClick={() => navigate("/merecimento")}
          >
            <FileBarChart className="h-5 w-5 text-cbmepi-purple" />
            <div>
              <p className="text-sm font-medium">Quadro de Merecimento</p>
              <p className="text-xs text-gray-500">Análise de pontuação</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
