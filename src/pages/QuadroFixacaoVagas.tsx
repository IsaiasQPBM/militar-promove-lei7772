
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";
import { QuadroMilitar } from "@/types";

// Definição do tipo de dados para o QFV
interface QFVData {
  posto: string;
  vagasLei: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
}

const QuadroFixacaoVagas = () => {
  const navigate = useNavigate();
  const [qfvData, setQFVData] = useState<Record<QuadroMilitar | string, QFVData[]>>({
    QOEM: [],
    QOE: [],
    "QOBM-S": [],
    "QOBM-E": [],
    "QOBM-C": [],
    QORR: [],
    QPBM: [],
    QPRR: []
  });
  const [activeTab, setActiveTab] = useState<string>("QOEM");
  const [loading, setLoading] = useState(true);

  // Dados da Lei nº 7.772/2022
  const vagasLei = {
    // I – QUADRO DE OFICIAIS BOMBEIROS MILITAR COMBATENTES
    QOEM: {
      "Coronel": 6,
      "Tenente-Coronel": 16,
      "Major": 35,
      "Capitão": 38,
      "1º Tenente": 50,
      "2º Tenente": 56
    },
    // II – QUADRO DE OFICIAIS BOMBEIROS MILITAR DE SAÚDE
    "QOBM-S": {
      "Coronel": 0,
      "Tenente-Coronel": 1,
      "Major": 1,
      "Capitão": 2,
      "1º Tenente": 2,
      "2º Tenente": 6
    },
    // III – QUADRO DE OFICIAIS BOMBEIROS MILITAR ENGENHEIROS
    "QOBM-E": {
      "Coronel": 0,
      "Tenente-Coronel": 2,
      "Major": 2,
      "Capitão": 2,
      "1º Tenente": 2,
      "2º Tenente": 2
    },
    // IV- QUADRO DE OFICIAIS BOMBEIROS MILITAR COMPLEMENTARES
    "QOBM-C": {
      "Coronel": 0,
      "Tenente-Coronel": 0,
      "Major": 6,
      "Capitão": 24,
      "1º Tenente": 36,
      "2º Tenente": 41
    },
    // QOE - Mantendo para compatibilidade com dados existentes
    QOE: {
      "Coronel": 0,
      "Tenente-Coronel": 1,
      "Major": 2,
      "Capitão": 3,
      "1º Tenente": 5,
      "2º Tenente": 8
    },
    // V – QUADRO DE PRAÇAS BOMBEIROS MILITAR
    QPBM: {
      "Subtenente": 63,
      "1º Sargento": 102,
      "2º Sargento": 130,
      "3º Sargento": 150,
      "Cabo": 240,
      "Soldado": 428
    },
    QORR: {},
    QPRR: {}
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      try {
        // Buscar todos os militares ativos
        const { data: militares, error } = await supabase
          .from("militares")
          .select("posto, quadro, situacao")
          .eq("situacao", "ativo");
          
        if (error) throw error;
        
        // Contar militares por posto e quadro
        const contagem: Record<string, Record<string, number>> = {
          QOEM: {},
          QOE: {},
          "QOBM-S": {},
          "QOBM-E": {},
          "QOBM-C": {},
          QORR: {},
          QPBM: {},
          QPRR: {}
        };
        
        militares.forEach(militar => {
          const { posto, quadro } = militar;
          if (posto && quadro) {
            if (!contagem[quadro]) {
              contagem[quadro] = {};
            }
            
            if (!contagem[quadro][posto]) {
              contagem[quadro][posto] = 0;
            }
            
            contagem[quadro][posto]++;
          }
        });
        
        // Calcular vagas disponíveis por quadro e posto
        const dadosQFV: Record<string, QFVData[]> = {
          QOEM: [],
          QOE: [],
          "QOBM-S": [],
          "QOBM-E": [],
          "QOBM-C": [],
          QORR: [],
          QPBM: [],
          QPRR: []
        };
        
        // Processar cada quadro
        Object.keys(vagasLei).forEach(quadro => {
          if (quadro === "QORR" || quadro === "QPRR") {
            // Para os quadros de reserva, mostrar apenas a contagem
            const postosQuadro = Object.keys(contagem[quadro] || {});
            postosQuadro.forEach(posto => {
              const vagasOcupadas = contagem[quadro][posto] || 0;
              
              dadosQFV[quadro].push({
                posto,
                vagasLei: 0, // Sem limite na reserva
                vagasOcupadas,
                vagasDisponiveis: 0
              });
            });
          } else {
            // Para os quadros ativos, mostrar vagas da lei, ocupadas e disponíveis
            Object.keys(vagasLei[quadro]).forEach(posto => {
              const vagasLeiPosto = vagasLei[quadro][posto] || 0;
              const vagasOcupadas = contagem[quadro]?.[posto] || 0;
              
              dadosQFV[quadro].push({
                posto,
                vagasLei: vagasLeiPosto,
                vagasOcupadas,
                vagasDisponiveis: Math.max(0, vagasLeiPosto - vagasOcupadas)
              });
            });
          }
        });
        
        setQFVData(dadosQFV);
        
      } catch (error) {
        console.error("Erro ao carregar dados do QFV:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do Quadro de Fixação de Vagas.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  // Função para ordenar os postos corretamente
  const ordenarPostos = (a: QFVData, b: QFVData) => {
    const ordemPostos = [
      "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
      "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
    ];
    
    return ordemPostos.indexOf(a.posto) - ordemPostos.indexOf(b.posto);
  };
  
  // Função para exportar os dados para CSV
  const exportarDadosCSV = () => {
    try {
      // Cabeçalho do CSV
      let csv = "Quadro,Posto,Vagas Previstas em Lei,Vagas Ocupadas,Vagas Disponíveis\n";
      
      // Adicionar dados de cada quadro
      Object.entries(qfvData).forEach(([quadro, dados]) => {
        dados.sort(ordenarPostos).forEach(item => {
          const linha = `${quadro},${item.posto},${item.vagasLei},${item.vagasOcupadas},${item.vagasDisponiveis}\n`;
          csv += linha;
        });
      });
      
      // Criar e forçar download do arquivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `QFV_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso."
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
    }
  };
  
  // Função para renderizar a tabela do QFV
  const renderTabelaQFV = (quadro: string) => {
    const dados = [...(qfvData[quadro] || [])].sort(ordenarPostos);
    
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posto/Graduação</TableHead>
              <TableHead className="text-center">Vagas Previstas em Lei</TableHead>
              <TableHead className="text-center">Vagas Ocupadas</TableHead>
              <TableHead className="text-center">Vagas Disponíveis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.length > 0 ? (
              dados.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.posto}</TableCell>
                  <TableCell className="text-center">
                    {quadro === "QORR" || quadro === "QPRR" ? 
                      "N/A" : 
                      item.vagasLei
                    }
                  </TableCell>
                  <TableCell className="text-center">{item.vagasOcupadas}</TableCell>
                  <TableCell className="text-center">
                    {quadro === "QORR" || quadro === "QPRR" ? 
                      "N/A" : 
                      item.vagasDisponiveis
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Não há dados disponíveis para este quadro.
                </TableCell>
              </TableRow>
            )}
            {/* Adicionar linha de totais para quadros ativos */}
            {quadro !== "QORR" && quadro !== "QPRR" && dados.length > 0 && (
              <TableRow className="bg-gray-50 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-center">
                  {dados.reduce((sum, item) => sum + item.vagasLei, 0)}
                </TableCell>
                <TableCell className="text-center">
                  {dados.reduce((sum, item) => sum + item.vagasOcupadas, 0)}
                </TableCell>
                <TableCell className="text-center">
                  {dados.reduce((sum, item) => sum + item.vagasDisponiveis, 0)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV)</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open("https://www.pi.gov.br/leis/lei-no-7-772-de-13-de-outubro-de-2022/", "_blank")}
          >
            <FileText className="h-4 w-4" />
            Lei nº 7.772/2022
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportarDadosCSV}
          >
            <Download className="h-4 w-4" />
            Exportar Dados
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Distribuição de Vagas por Quadro</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <LoaderComponent message="Carregando dados do quadro de fixação de vagas..." />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-8 mb-6">
                <TabsTrigger value="QOEM">Combatentes</TabsTrigger>
                <TabsTrigger value="QOBM-S">Saúde</TabsTrigger>
                <TabsTrigger value="QOBM-E">Engenheiros</TabsTrigger>
                <TabsTrigger value="QOBM-C">Complementares</TabsTrigger>
                <TabsTrigger value="QOE">Especialistas</TabsTrigger>
                <TabsTrigger value="QORR">Oficiais Reserva</TabsTrigger>
                <TabsTrigger value="QPBM">Praças Ativos</TabsTrigger>
                <TabsTrigger value="QPRR">Praças Reserva</TabsTrigger>
              </TabsList>
              
              <TabsContent value="QOEM" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais Bombeiros Militar Combatentes (QOEM)</h2>
                {renderTabelaQFV("QOEM")}
              </TabsContent>
              
              <TabsContent value="QOE" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais Especialistas (QOE)</h2>
                {renderTabelaQFV("QOE")}
              </TabsContent>
              
              <TabsContent value="QOBM-S" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais Bombeiros Militar de Saúde (QOBM-S)</h2>
                {renderTabelaQFV("QOBM-S")}
              </TabsContent>
              
              <TabsContent value="QOBM-E" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais Bombeiros Militar Engenheiros (QOBM-E)</h2>
                {renderTabelaQFV("QOBM-E")}
              </TabsContent>
              
              <TabsContent value="QOBM-C" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais Bombeiros Militar Complementares (QOBM-C)</h2>
                {renderTabelaQFV("QOBM-C")}
              </TabsContent>
              
              <TabsContent value="QORR" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais da Reserva Remunerada (QORR)</h2>
                {renderTabelaQFV("QORR")}
              </TabsContent>
              
              <TabsContent value="QPBM" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Praças Bombeiros Militares (QPBM)</h2>
                {renderTabelaQFV("QPBM")}
              </TabsContent>
              
              <TabsContent value="QPRR" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Praças da Reserva Remunerada (QPRR)</h2>
                {renderTabelaQFV("QPRR")}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Tabela de resumo */}
      <Card>
        <CardHeader className="bg-green-700 text-white">
          <CardTitle>Resumo Geral do Efetivo</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Efetivo Previsto</TableHead>
                  <TableHead className="text-center">Efetivo Existente</TableHead>
                  <TableHead className="text-center">Vagas Disponíveis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Oficiais</TableCell>
                  <TableCell className="text-center">329</TableCell>
                  <TableCell className="text-center">
                    {loading ? "..." : 
                      Object.entries(qfvData).filter(([quadro]) => 
                        quadro === "QOEM" || quadro === "QOE" || quadro === "QOBM-S" || 
                        quadro === "QOBM-E" || quadro === "QOBM-C"
                      ).reduce((total, [_, data]) => 
                        total + data.reduce((sum, item) => sum + item.vagasOcupadas, 0), 0
                      )
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    {loading ? "..." :
                      Object.entries(qfvData).filter(([quadro]) => 
                        quadro === "QOEM" || quadro === "QOE" || quadro === "QOBM-S" || 
                        quadro === "QOBM-E" || quadro === "QOBM-C"
                      ).reduce((total, [_, data]) => 
                        total + data.reduce((sum, item) => sum + item.vagasDisponiveis, 0), 0
                      )
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Praças</TableCell>
                  <TableCell className="text-center">1113</TableCell>
                  <TableCell className="text-center">
                    {loading ? "..." :
                      (qfvData["QPBM"] || []).reduce((sum, item) => sum + item.vagasOcupadas, 0)
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    {loading ? "..." :
                      (qfvData["QPBM"] || []).reduce((sum, item) => sum + item.vagasDisponiveis, 0)
                    }
                  </TableCell>
                </TableRow>
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">1442</TableCell>
                  <TableCell className="text-center">
                    {loading ? "..." :
                      Object.entries(qfvData).filter(([quadro]) => 
                        quadro !== "QORR" && quadro !== "QPRR"
                      ).reduce((total, [_, data]) => 
                        total + data.reduce((sum, item) => sum + item.vagasOcupadas, 0), 0
                      )
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    {loading ? "..." :
                      Object.entries(qfvData).filter(([quadro]) => 
                        quadro !== "QORR" && quadro !== "QPRR"
                      ).reduce((total, [_, data]) => 
                        total + data.reduce((sum, item) => sum + item.vagasDisponiveis, 0), 0
                      )
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuadroFixacaoVagas;
