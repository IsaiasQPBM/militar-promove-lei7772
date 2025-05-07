
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Loader2, BarChart4, BarChart2, UserCheck, Users, Medal, Award, Calendar, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { QuadroMilitar, PostoPatente } from '@/types';
import { verificarPeriodoQuadroAcesso } from '@/services/promocaoService';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalMilitares, setTotalMilitares] = useState(0);
  const [militaresAtivos, setMilitaresAtivos] = useState(0);
  const [militaresPorQuadro, setMilitaresPorQuadro] = useState<Record<string, number>>({});
  const [militaresPorPosto, setMilitaresPorPosto] = useState<Record<string, number>>({});
  const [quadroAcessoAberto, setQuadroAcessoAberto] = useState(false);
  const [proximosPromoviveis, setProximosPromoviveis] = useState<any[]>([]);
  const [ultimasPromocoes, setUltimasPromocoes] = useState<any[]>([]);
  const [vagasDisponiveisPorQuadro, setVagasDisponiveisPorQuadro] = useState<Record<string, number>>({});

  useEffect(() => {
    carregarDados();
    const periodoAtivo = verificarPeriodoQuadroAcesso();
    setQuadroAcessoAberto(periodoAtivo);
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    
    try {
      // Carregar contagem total de militares
      const { count: totalCount, error: totalError } = await supabase
        .from('militares')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      setTotalMilitares(totalCount || 0);
      
      // Carregar contagem de militares ativos
      const { count: ativosCount, error: ativosError } = await supabase
        .from('militares')
        .select('*', { count: 'exact', head: true })
        .eq('situacao', 'ativo');
        
      if (ativosError) throw ativosError;
      setMilitaresAtivos(ativosCount || 0);
      
      // Carregar militares por quadro
      const { data: quadroData, error: quadroError } = await supabase
        .from('militares')
        .select('quadro')
        .eq('situacao', 'ativo');
        
      if (quadroError) throw quadroError;
      
      const quadroCounts: Record<string, number> = {};
      quadroData.forEach(item => {
        quadroCounts[item.quadro] = (quadroCounts[item.quadro] || 0) + 1;
      });
      setMilitaresPorQuadro(quadroCounts);
      
      // Carregar militares por posto
      const { data: postoData, error: postoError } = await supabase
        .from('militares')
        .select('posto')
        .eq('situacao', 'ativo');
        
      if (postoError) throw postoError;
      
      const postoCounts: Record<string, number> = {};
      postoData.forEach(item => {
        postoCounts[item.posto] = (postoCounts[item.posto] || 0) + 1;
      });
      setMilitaresPorPosto(postoCounts);
      
      // Carregar próximos promovíveis
      const { data: promoviveisData, error: promoviveisError } = await supabase
        .from('militares')
        .select(`
          id, 
          nome, 
          posto, 
          quadro, 
          dataultimapromocao,
          fichas_conceito(temposervicoquadro)
        `)
        .eq('situacao', 'ativo')
        .order('dataultimapromocao', { ascending: true })
        .limit(5);
        
      if (promoviveisError) throw promoviveisError;
      setProximosPromoviveis(promoviveisData);
      
      // Carregar últimas promoções
      const { data: promocoesData, error: promocoesError } = await supabase
        .from('promocoes')
        .select(`
          id,
          data_promocao,
          tipo_promocao,
          militares(id, nome, posto, quadro)
        `)
        .order('data_promocao', { ascending: false })
        .limit(5);
        
      if (promocoesError) throw promocoesError;
      setUltimasPromocoes(promocoesData);
      
      // Simular vagas disponíveis por quadro (em uma implementação real, isso viria do qfvService)
      setVagasDisponiveisPorQuadro({
        'QOEM': 3,
        'QOE': 2,
        'QOBM-S': 1,
        'QOBM-E': 2,
        'QOBM-C': 1,
        'QPBM': 5
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados para o dashboard:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar as informações do dashboard.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
    
    toast({
      title: 'Dados atualizados',
      description: 'As informações do dashboard foram atualizadas.'
    });
  };

  // Preparar dados para os gráficos
  const dadosGraficoQuadro = {
    labels: Object.keys(militaresPorQuadro),
    datasets: [
      {
        label: 'Militares por Quadro',
        data: Object.values(militaresPorQuadro),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de postos, ordenados por hierarquia
  const ordenarPostos = () => {
    const ordemPostos = [
      "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
      "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
    ];
    
    const labels: string[] = [];
    const data: number[] = [];
    
    ordemPostos.forEach(posto => {
      if (militaresPorPosto[posto] !== undefined) {
        labels.push(posto);
        data.push(militaresPorPosto[posto]);
      }
    });
    
    return { labels, data };
  };

  const dadosOrdenados = ordenarPostos();
  
  const dadosGraficoPosto = {
    labels: dadosOrdenados.labels,
    datasets: [
      {
        label: 'Militares por Posto',
        data: dadosOrdenados.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const renderProximosPromoviveis = () => {
    if (proximosPromoviveis.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          Nenhum militar elegível para promoção no momento.
        </div>
      );
    }
    
    return proximosPromoviveis.map(militar => {
      // Cálculo do tempo desde a última promoção
      const dataUltimaPromocao = militar.dataultimapromocao 
        ? new Date(militar.dataultimapromocao)
        : null;
        
      const tempoServico = militar.fichas_conceito?.[0]?.temposervicoquadro || 0;
      
      return (
        <div key={militar.id} className="flex justify-between items-center py-2 border-b last:border-0">
          <div>
            <p className="font-medium">{militar.nome}</p>
            <p className="text-sm text-gray-600">{militar.posto} - {militar.quadro}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              <span className="font-medium">{tempoServico}</span> meses no posto
            </p>
            {dataUltimaPromocao && (
              <p className="text-xs text-gray-500">
                Última promoção: {format(dataUltimaPromocao, 'dd/MM/yyyy')}
              </p>
            )}
          </div>
        </div>
      );
    });
  };

  const renderUltimasPromocoes = () => {
    if (ultimasPromocoes.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          Nenhuma promoção registrada.
        </div>
      );
    }
    
    return ultimasPromocoes.map(promocao => {
      const dataPromocao = promocao.data_promocao 
        ? new Date(promocao.data_promocao)
        : null;
        
      return (
        <div key={promocao.id} className="flex justify-between items-center py-2 border-b last:border-0">
          <div>
            <p className="font-medium">{promocao.militares?.nome || "Militar não encontrado"}</p>
            <p className="text-sm text-gray-600">
              {promocao.militares?.posto || "-"} - {promocao.militares?.quadro || "-"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              <span className="font-medium">{promocao.tipo_promocao || "Não especificado"}</span>
            </p>
            {dataPromocao && (
              <p className="text-xs text-gray-500">
                {format(dataPromocao, 'dd/MM/yyyy')}
              </p>
            )}
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </Button>
      </div>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Militares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">{totalMilitares}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Militares Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{militaresAtivos}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({Math.round((militaresAtivos / totalMilitares) * 100)}%)
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Vagas Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">
                {Object.values(vagasDisponiveisPorQuadro).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Status Quadro de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              <span className={`font-medium ${quadroAcessoAberto ? 'text-green-600' : 'text-gray-600'}`}>
                {quadroAcessoAberto ? 'Aberto' : 'Fechado'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Próxima data: {format(new Date(2024, 6, 18), 'dd/MM/yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart4 className="h-5 w-5 mr-2" />
              Distribuição por Quadro
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              {Object.keys(militaresPorQuadro).length > 0 ? (
                <PieChart data={dadosGraficoQuadro} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Sem dados disponíveis</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" />
              Distribuição por Posto/Graduação
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              {Object.keys(militaresPorPosto).length > 0 ? (
                <BarChart data={dadosGraficoPosto} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Sem dados disponíveis</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Cards de informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Militares Elegíveis para Promoção</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {renderProximosPromoviveis()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Últimas Promoções</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {renderUltimasPromocoes()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
