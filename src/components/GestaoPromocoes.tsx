
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MilitarComPontuacao, QuadroMilitar } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Loader2, BarChart } from "lucide-react";
import { verificarPeriodoQuadroAcesso, calcularProximaDataQuadroAcesso } from "@/services/promocaoService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MerecimentoList } from "@/components/merecimento/MerecimentoList";
import { MilitarList } from "@/components/antiguidade/MilitarList";
import { CriteriosAntiguidade } from "@/components/antiguidade/CriteriosAntiguidade";
import { CriteriosMerecimento } from "@/components/merecimento/CriteriosMerecimento";
import SimuladorPromocao from "@/components/promocoes/SimuladorPromocao";
import RelatoriosPromocao from "@/components/promocoes/RelatoriosPromocao";
import DetalhesElegibilidadeModal from "@/components/promocoes/DetalhesElegibilidadeModal";

const GestaoPromocoesComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("antiguidade");
  const [reportsTab, setReportsTab] = useState(false);
  const [quadroSelecionado, setQuadroSelecionado] = useState<QuadroMilitar>("QOEM");
  const [militaresElegiveis, setMilitaresElegiveis] = useState<MilitarComPontuacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodoAtivo, setPeriodoAtivo] = useState(false);
  const [proximaData, setProximaData] = useState<Date | null>(null);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [militarDetalhesId, setMilitarDetalhesId] = useState<string | null>(null);
  const [militarDetalhesPosto, setMilitarDetalhesPosto] = useState<string>("");
  const [militarDetalhesQuadro, setMilitarDetalhesQuadro] = useState<string>("");

  // Função para verificar elegibilidade
  const buscarMilitaresElegiveis = async (quadro: QuadroMilitar) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("militares")
        .select(`
          *,
          fichas_conceito(totalpontos, temposervicoquadro)
        `)
        .eq("quadro", quadro)
        .eq("situacao", "ativo")
        .order("posto", { ascending: false });
        
      if (error) throw error;
      
      // Transformar os dados para incluir pontuação
      const militaresComPontuacao: MilitarComPontuacao[] = data.map((militar: any) => ({
        id: militar.id,
        nome: militar.nome,
        nomeCompleto: militar.nome,
        nomeGuerra: militar.nomeguerra || militar.nome,
        posto: militar.posto,
        quadro: militar.quadro,
        dataNascimento: militar.datanascimento,
        dataInclusao: militar.data_ingresso,
        dataUltimaPromocao: militar.dataultimapromocao,
        situacao: militar.situacao,
        email: militar.email,
        foto: militar.foto,
        tipoSanguineo: militar.tipo_sanguineo,
        sexo: militar.sexo,
        unidade: militar.unidade || '',
        pontuacao: militar.fichas_conceito?.[0]?.totalpontos || 0
      }));
      
      setMilitaresElegiveis(militaresComPontuacao);
    } catch (error) {
      console.error("Erro ao buscar militares elegíveis:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de militares elegíveis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar período de inclusão no quadro de acesso
  useEffect(() => {
    const estaNoPeriodo = verificarPeriodoQuadroAcesso();
    setPeriodoAtivo(estaNoPeriodo);
    
    const proximaDataAcesso = calcularProximaDataQuadroAcesso();
    setProximaData(proximaDataAcesso);
  }, []);

  // Carregar militares quando o quadro mudar
  useEffect(() => {
    buscarMilitaresElegiveis(quadroSelecionado);
  }, [quadroSelecionado]);

  // Função para mostrar detalhes da elegibilidade
  const mostrarDetalhesElegibilidade = (militarId: string, posto: string, quadro: string) => {
    setMilitarDetalhesId(militarId);
    setMilitarDetalhesPosto(posto);
    setMilitarDetalhesQuadro(quadro);
    setDetalhesModalOpen(true);
  };

  // Lista de quadros disponíveis
  const quadrosDisponiveis: QuadroMilitar[] = ["QOEM", "QOE", "QOBM-S", "QOBM-E", "QOBM-C", "QPBM"];

  return (
    <div className="space-y-4">
      {/* Alerta de período de inclusão */}
      {periodoAtivo ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <span className="font-medium">Período ativo para inclusão no Quadro de Acesso!</span> As inclusões estão abertas até {proximaData && format(proximaData, "dd 'de' MMMM", { locale: ptBR })}.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Próxima inclusão no Quadro de Acesso:</span> {proximaData && format(proximaData, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Gestão de Promoções</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {reportsTab ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <BarChart className="mr-2 h-6 w-6" />
                    Relatórios de Promoção
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Gere relatórios personalizados para análise de promoção
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setReportsTab(false)}
                >
                  Voltar para Gestão de Promoções
                </Button>
              </div>
              
              <RelatoriosPromocao quadros={quadrosDisponiveis} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Análise de Elegibilidade</h2>
                  <p className="text-gray-500">
                    Acompanhe os militares elegíveis para promoção
                  </p>
                </div>
                <Button
                  onClick={() => setReportsTab(true)}
                  className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                >
                  Relatórios
                </Button>
              </div>
              
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="antiguidade">Por Antiguidade</TabsTrigger>
                    <TabsTrigger value="merecimento">Por Merecimento</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="antiguidade" className="space-y-4 pt-4">
                    <CriteriosAntiguidade />
                    
                    <div className="mt-6">
                      {loading ? (
                        <div className="flex justify-center items-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-cbmepi-purple" />
                        </div>
                      ) : (
                        <MilitarList 
                          militares={militaresElegiveis} 
                          onQuadroChange={setQuadroSelecionado}
                          quadroAtual={quadroSelecionado}
                          onShowDetails={mostrarDetalhesElegibilidade}
                        />
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="merecimento" className="space-y-4 pt-4">
                    <CriteriosMerecimento />
                    
                    <div className="mt-6">
                      {loading ? (
                        <div className="flex justify-center items-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-cbmepi-purple" />
                        </div>
                      ) : (
                        <MerecimentoList 
                          militares={militaresElegiveis} 
                          onQuadroChange={setQuadroSelecionado}
                          quadroAtual={quadroSelecionado}
                          onShowDetails={mostrarDetalhesElegibilidade}
                        />
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <SimuladorPromocao quadroSelecionado={quadroSelecionado} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <DetalhesElegibilidadeModal 
        isOpen={detalhesModalOpen}
        onClose={() => setDetalhesModalOpen(false)}
        militarId={militarDetalhesId}
        posto={militarDetalhesPosto}
        quadro={militarDetalhesQuadro}
      />
    </div>
  );
};

export default GestaoPromocoesComponent;
