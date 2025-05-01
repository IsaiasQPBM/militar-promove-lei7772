
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";
import { Militar } from "@/types";
import { toQuadroMilitar, toPostoPatente, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";
import { 
  calcularPrevisaoIndividual, 
  PrevisaoPromocao, 
  tempoPromocoesOficiais, 
  tempoPromocoesPracas, 
  getBadgeVariant 
} from "@/utils/promocaoUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ProximosPromocao = () => {
  const [loading, setLoading] = useState(true);
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoPromocao[]>([]);
  const [activeTab, setActiveTab] = useState<string>("oficiais");
  
  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        
        // Buscar militares da ativa
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo");
          
        if (error) throw error;
        
        // Converter para o formato Militar
        const militaresFormatados: Militar[] = data.map(item => ({
          id: item.id,
          nomeCompleto: item.nome,
          nomeGuerra: item.nomeguerra,
          posto: toPostoPatente(item.posto),
          quadro: toQuadroMilitar(item.quadro),
          dataNascimento: item.datanascimento,
          dataInclusao: item.data_ingresso,
          dataUltimaPromocao: item.dataultimapromocao,
          situacao: toSituacaoMilitar(item.situacao),
          email: item.email,
          foto: item.foto,
          tipoSanguineo: toTipoSanguineo(item.tipo_sanguineo),
          sexo: toSexo(item.sexo)
        }));
        
        setMilitares(militaresFormatados);
        
        // Calcular previsões para cada militar
        const previsoesCalculadas = militaresFormatados.map(militar => 
          calcularPrevisaoIndividual(militar)
        ).filter(previsao => 
          // Filtrar apenas militares com próximo posto definido
          previsao.proximoPosto !== null
        );
        
        setPrevisoes(previsoesCalculadas);
        
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitares();
  }, []);
  
  // Ordenar previsões por urgência (menor tempo restante primeiro)
  const ordenarPorUrgencia = (previsoes: PrevisaoPromocao[]) => {
    return [...previsoes].sort((a, b) => {
      // Promoções disponíveis primeiro
      if (a.tempoRestante === "Promoção disponível" && b.tempoRestante !== "Promoção disponível") {
        return -1;
      }
      if (b.tempoRestante === "Promoção disponível" && a.tempoRestante !== "Promoção disponível") {
        return 1;
      }
      
      // Depois ordenar por data da próxima promoção
      const dataA = a.dataProximaPromocao?.getTime() || 0;
      const dataB = b.dataProximaPromocao?.getTime() || 0;
      return dataA - dataB;
    });
  };
  
  // Separar oficiais e praças
  const previsoesOficiais = ordenarPorUrgencia(
    previsoes.filter(p => 
      ["QOEM", "QOE"].includes(militares.find(m => m.id === p.militarId)?.quadro || "")
    )
  );
  
  const previsoesPracas = ordenarPorUrgencia(
    previsoes.filter(p => 
      ["QPBM"].includes(militares.find(m => m.id === p.militarId)?.quadro || "")
    )
  );
  
  // Verificar se está próximo da promoção (menos de 3 meses)
  const isProximoDaPromocao = (tempoRestante: string): boolean => {
    return tempoRestante === "Promoção disponível" || 
           tempoRestante.includes("dias") ||
           (tempoRestante.includes("meses") && !tempoRestante.includes("ano"));
  };
  
  // Renderizar tabela de previsões
  const renderTabelaPrevisoes = (previsoes: PrevisaoPromocao[]) => {
    if (previsoes.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          Nenhum militar encontrado com previsão de promoção.
        </div>
      );
    }
    
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Posto Atual</TableHead>
              <TableHead>Próximo Posto</TableHead>
              <TableHead>Última Promoção</TableHead>
              <TableHead>Próxima Promoção</TableHead>
              <TableHead>Tempo Restante</TableHead>
              <TableHead>Critério</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previsoes.map((previsao) => {
              const militar = militares.find(m => m.id === previsao.militarId);
              if (!militar) return null;
              
              return (
                <TableRow key={previsao.militarId}>
                  <TableCell className="font-medium">{militar.nomeGuerra}</TableCell>
                  <TableCell>{militar.posto}</TableCell>
                  <TableCell>{previsao.proximoPosto}</TableCell>
                  <TableCell>
                    {format(new Date(previsao.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {previsao.dataProximaPromocao ? 
                      format(new Date(previsao.dataProximaPromocao), "dd/MM/yyyy", { locale: ptBR }) : 
                      "N/A"
                    }
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeVariant(previsao.tempoRestante)}>
                      {previsao.tempoRestante}
                    </Badge>
                  </TableCell>
                  <TableCell>{previsao.criterio}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Renderizar cards para militares que estão próximos da promoção
  const renderCardsMilitaresProximos = () => {
    const proximos = [...previsoesOficiais, ...previsoesPracas]
      .filter(p => isProximoDaPromocao(p.tempoRestante))
      .slice(0, 3); // Limitar a 3 para não sobrecarregar a visualização
    
    if (proximos.length === 0) {
      return (
        <div className="text-center p-4">
          Nenhum militar com promoção próxima no momento.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {proximos.map(previsao => {
          const militar = militares.find(m => m.id === previsao.militarId);
          if (!militar) return null;
          
          return (
            <Card key={previsao.militarId}>
              <CardHeader className="bg-cbmepi-purple text-white py-3">
                <CardTitle className="text-sm font-medium">{militar.nomeGuerra}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Posto atual:</span>
                    <span className="font-medium">{militar.posto}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Próximo posto:</span>
                    <span className="font-medium">{previsao.proximoPosto}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Critério:</span>
                    <span className="font-medium">{previsao.criterio}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Badge className={getBadgeVariant(previsao.tempoRestante)}>
                      {previsao.tempoRestante}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Próximos da Promoção</h1>
      
      {loading ? (
        <LoaderComponent message="Carregando dados de promoções..." />
      ) : (
        <>
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Militares Próximos da Promoção</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {renderCardsMilitaresProximos()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Lista Completa de Promoções Previstas</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="oficiais">Oficiais</TabsTrigger>
                  <TabsTrigger value="pracas">Praças</TabsTrigger>
                </TabsList>
                
                <TabsContent value="oficiais" className="space-y-4">
                  <h2 className="text-lg font-semibold">Oficiais</h2>
                  {renderTabelaPrevisoes(previsoesOficiais)}
                  
                  <div className="mt-6 p-4 border rounded-md">
                    <h3 className="font-semibold mb-2">Critérios para promoção de Oficiais:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {Object.entries(tempoPromocoesOficiais)
                        .filter(([_, info]) => info.proximoPosto !== null)
                        .map(([posto, info]) => (
                          <li key={posto}>
                            <span className="font-medium">{posto} → {info.proximoPosto}:</span> {info.tempoMinimo} anos ({info.criterio})
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="pracas" className="space-y-4">
                  <h2 className="text-lg font-semibold">Praças</h2>
                  {renderTabelaPrevisoes(previsoesPracas)}
                  
                  <div className="mt-6 p-4 border rounded-md">
                    <h3 className="font-semibold mb-2">Critérios para promoção de Praças:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {Object.entries(tempoPromocoesPracas)
                        .filter(([_, info]) => info.proximoPosto !== null)
                        .map(([posto, info]) => (
                          <li key={posto}>
                            <span className="font-medium">{posto} → {info.proximoPosto}:</span> {info.tempoMinimo} anos ({info.criterio})
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProximosPromocao;
