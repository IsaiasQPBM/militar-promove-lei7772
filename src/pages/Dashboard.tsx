
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Users, Award, Calendar, Clipboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";
import { QuadroMilitar } from "@/types";
import { calcularVagasDisponiveis, obterTotalVagasLei } from "@/services/qfvService";

// Definição dos tipos
type QuadroContagem = {
  quadro: string;
  total: number;
  color: string;
};

type SituacaoContagem = {
  situacao: string;
  total: number;
  color: string;
};

type PromocoesAnuais = {
  ano: number;
  quantidade: number;
};

// Cores para os gráficos
const CORES = {
  QOEM: "#9b87f5", // Primary Purple
  QOE: "#7E69AB", // Secondary Purple
  QORR: "#6E59A5", // Tertiary Purple
  QPBM: "#1EAEDB", // Bright Blue
  QPRR: "#33C3F0", // Sky Blue
  ativo: "#4CAF50", // Green
  inativo: "#FF9800", // Orange
  promocoesBarra: "#9b87f5", // Primary Purple
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalMilitares, setTotalMilitares] = useState(0);
  const [contagemPorQuadro, setContagemPorQuadro] = useState<QuadroContagem[]>([]);
  const [contagemPorSituacao, setContagemPorSituacao] = useState<SituacaoContagem[]>([]);
  const [promocoesAnuais, setPromocoesAnuais] = useState<PromocoesAnuais[]>([]);
  const [vagasDisponiveis, setVagasDisponiveis] = useState(0);
  const [vagasTotais, setVagasTotais] = useState(0);
  const [militaresPromovendos, setMilitaresPromovendos] = useState(0);
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // 1. Buscar contagem de militares por quadro e situação
        const { data: militares, error } = await supabase
          .from("militares")
          .select("quadro, situacao");
          
        if (error) throw error;
        
        // Calcular total de militares
        setTotalMilitares(militares.length);
        
        // Contagem por quadro
        const contagemQuadro: Record<string, number> = {};
        
        militares.forEach(militar => {
          const quadro = militar.quadro || "Não informado";
          contagemQuadro[quadro] = (contagemQuadro[quadro] || 0) + 1;
        });
        
        // Converter para array
        const dadosQuadro = Object.entries(contagemQuadro).map(([quadro, total]) => ({
          quadro,
          total,
          color: CORES[quadro as QuadroMilitar] || "#CCCCCC"
        }));
        
        setContagemPorQuadro(dadosQuadro);
        
        // Contagem por situação
        const contagemSituacao: Record<string, number> = {};
        
        militares.forEach(militar => {
          const situacao = militar.situacao || "Não informado";
          contagemSituacao[situacao] = (contagemSituacao[situacao] || 0) + 1;
        });
        
        // Converter para array
        const dadosSituacao = Object.entries(contagemSituacao).map(([situacao, total]) => ({
          situacao,
          total,
          color: CORES[situacao] || "#CCCCCC"
        }));
        
        setContagemPorSituacao(dadosSituacao);
        
        // 2. Buscar promoções por ano
        const { data: promocoes, error: erroPromocoes } = await supabase
          .from("promocoes")
          .select("data_promocao");
          
        if (erroPromocoes) throw erroPromocoes;
        
        // Agrupar por ano
        const promocoesAno: Record<number, number> = {};
        
        promocoes.forEach(promocao => {
          if (promocao.data_promocao) {
            const ano = new Date(promocao.data_promocao).getFullYear();
            promocoesAno[ano] = (promocoesAno[ano] || 0) + 1;
          }
        });
        
        // Converter para array
        const dadosPromocoes = Object.entries(promocoesAno)
          .map(([ano, quantidade]) => ({
            ano: parseInt(ano),
            quantidade
          }))
          .sort((a, b) => a.ano - b.ano); // Ordenar por ano
        
        setPromocoesAnuais(dadosPromocoes);
        
        // 3. Calcular vagas disponíveis
        const vagasDisponiveis = await calcularVagasDisponiveis();
        const totalVagasDisponiveis = Object.values(vagasDisponiveis).reduce(
          (total, quadro) => total + Object.values(quadro).reduce((sum, vagas) => sum + vagas, 0), 
          0
        );
        
        setVagasDisponiveis(totalVagasDisponiveis);
        
        // 4. Obter total de vagas pela lei
        const totaisLei = obterTotalVagasLei();
        const totalVagasLei = Object.values(totaisLei).reduce((sum, total) => sum + total, 0);
        
        setVagasTotais(totalVagasLei);
        
        // 5. Estimar militares próximos da promoção (simplificado)
        // Estimativa: militares com data de última promoção há mais de 2 anos
        const doisAnosAtras = new Date();
        doisAnosAtras.setFullYear(doisAnosAtras.getFullYear() - 2);
        
        const { data: militaresPromovendos, error: erroPromovendos } = await supabase
          .from("militares")
          .select("id")
          .eq("situacao", "ativo")
          .lt("dataultimapromocao", doisAnosAtras.toISOString())
          .limit(1000); // Limitando para não sobrecarregar
          
        if (erroPromovendos) throw erroPromovendos;
        
        setMilitaresPromovendos(militaresPromovendos?.length || 0);
        
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Painel de Controle</h1>
      
      {loading ? (
        <LoaderComponent message="Carregando dados do dashboard..." />
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Militares</CardTitle>
                <Users className="h-4 w-4 text-cbmepi-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMilitares}</div>
                <p className="text-xs text-gray-500">
                  {contagemPorSituacao.find(item => item.situacao === "ativo")?.total || 0} ativos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vagas Disponíveis</CardTitle>
                <Clipboard className="h-4 w-4 text-cbmepi-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vagasDisponiveis}</div>
                <p className="text-xs text-gray-500">
                  de um total de {vagasTotais} vagas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos da Promoção</CardTitle>
                <Award className="h-4 w-4 text-cbmepi-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{militaresPromovendos}</div>
                <p className="text-xs text-gray-500">
                  militares elegíveis
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promoções Realizadas</CardTitle>
                <Calendar className="h-4 w-4 text-cbmepi-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {promocoesAnuais.reduce((sum, item) => sum + item.quantidade, 0)}
                </div>
                <p className="text-xs text-gray-500">
                  {promocoesAnuais.length > 0 
                    ? `${promocoesAnuais[promocoesAnuais.length-1].quantidade} no último ano`
                    : "Sem dados disponíveis"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Quadro</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contagemPorQuadro}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="quadro"
                      label={(entry) => entry.quadro}
                    >
                      {contagemPorQuadro.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} militares`, props.payload.quadro]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Militares por Situação</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contagemPorSituacao}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="situacao"
                      label={(entry) => entry.situacao === "ativo" ? "Ativos" : "Inativos"}
                    >
                      {contagemPorSituacao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} militares`, props.payload.situacao === "ativo" ? "Ativos" : "Inativos"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Promoções por Ano</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={promocoesAnuais}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} promoções`]} />
                    <Legend />
                    <Bar
                      dataKey="quantidade"
                      name="Promoções"
                      fill={CORES.promocoesBarra}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
