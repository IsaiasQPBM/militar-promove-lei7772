
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
import { obterTotalVagasLei } from "@/services/qfvService";

// Definição do tipo de dados para o QFV
interface QFVData {
  posto: string;
  vagasLei: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
}

const QuadroFixacaoVagas = () => {
  const navigate = useNavigate();
  const [qfvData, setQFVData] = useState<Record<QuadroMilitar, QFVData[]>>({
    QOEM: [],
    QOE: [],
    QORR: [],
    QPBM: [],
    QPRR: []
  });
  const [activeTab, setActiveTab] = useState<string>("QOEM");
  const [loading, setLoading] = useState(true);
  const [totais, setTotais] = useState<Record<string, { vagasLei: number; vagasOcupadas: number; vagasDisponiveis: number }>>({});

  // Dados da Lei nº 7.772/2022 (conforme anexo da Lei)
  const vagasLei = {
    QOEM: {
      "Coronel": 6,
      "Tenente-Coronel": 16,
      "Major": 35,
      "Capitão": 38,
      "1º Tenente": 50,
      "2º Tenente": 56
    },
    QOE: {
      "Tenente-Coronel": 2,
      "Major": 2,
      "Capitão": 2,
      "1º Tenente": 2,
      "2º Tenente": 2
    },
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
          .select("posto, quadro, situacao");
          
        if (error) throw error;
        
        // Separar militares por situação
        const militaresAtivos = militares.filter(m => m.situacao === "ativo");
        const militaresReserva = militares.filter(m => m.situacao === "inativo");
        
        // Contar militares por posto e quadro
        const contagem: Record<string, Record<string, number>> = {
          QOEM: {},
          QOE: {},
          QORR: {},
          QPBM: {},
          QPRR: {}
        };
        
        militaresAtivos.forEach(militar => {
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
        
        // Contar militares da reserva por posto e quadro
        const contagemReserva: Record<string, Record<string, number>> = {
          QORR: {},
          QPRR: {}
        };
        
        militaresReserva.forEach(militar => {
          const { posto, quadro } = militar;
          if (posto && (quadro === "QORR" || quadro === "QPRR")) {
            if (!contagemReserva[quadro]) {
              contagemReserva[quadro] = {};
            }
            
            if (!contagemReserva[quadro][posto]) {
              contagemReserva[quadro][posto] = 0;
            }
            
            contagemReserva[quadro][posto]++;
          }
        });
        
        // Calcular vagas disponíveis por quadro e posto
        const dadosQFV: Record<QuadroMilitar, QFVData[]> = {
          QOEM: [],
          QOE: [],
          QORR: [],
          QPBM: [],
          QPRR: []
        };
        
        // Inicializar totais
        const totaisTemp: Record<string, { vagasLei: number; vagasOcupadas: number; vagasDisponiveis: number }> = {
          QOEM: { vagasLei: 0, vagasOcupadas: 0, vagasDisponiveis: 0 },
          QOE: { vagasLei: 0, vagasOcupadas: 0, vagasDisponiveis: 0 },
          QPBM: { vagasLei: 0, vagasOcupadas: 0, vagasDisponiveis: 0 },
          QORR: { vagasLei: 0, vagasOcupadas: 0, vagasDisponiveis: 0 },
          QPRR: { vagasLei: 0, vagasOcupadas: 0, vagasDisponiveis: 0 }
        };
        
        // QOEM
        Object.keys(vagasLei.QOEM).forEach(posto => {
          const vagasLeiPosto = vagasLei.QOEM[posto as keyof typeof vagasLei.QOEM] || 0;
          const vagasOcupadas = contagem["QOEM"][posto] || 0;
          const vagasDisponiveis = Math.max(0, vagasLeiPosto - vagasOcupadas);
          
          dadosQFV.QOEM.push({
            posto,
            vagasLei: vagasLeiPosto,
            vagasOcupadas,
            vagasDisponiveis
          });
          
          // Atualizar totais
          totaisTemp.QOEM.vagasLei += vagasLeiPosto;
          totaisTemp.QOEM.vagasOcupadas += vagasOcupadas;
          totaisTemp.QOEM.vagasDisponiveis += vagasDisponiveis;
        });
        
        // QOE
        Object.keys(vagasLei.QOE).forEach(posto => {
          const vagasLeiPosto = vagasLei.QOE[posto as keyof typeof vagasLei.QOE] || 0;
          const vagasOcupadas = contagem["QOE"][posto] || 0;
          const vagasDisponiveis = Math.max(0, vagasLeiPosto - vagasOcupadas);
          
          dadosQFV.QOE.push({
            posto,
            vagasLei: vagasLeiPosto,
            vagasOcupadas,
            vagasDisponiveis
          });
          
          // Atualizar totais
          totaisTemp.QOE.vagasLei += vagasLeiPosto;
          totaisTemp.QOE.vagasOcupadas += vagasOcupadas;
          totaisTemp.QOE.vagasDisponiveis += vagasDisponiveis;
        });
        
        // QPBM
        Object.keys(vagasLei.QPBM).forEach(posto => {
          const vagasLeiPosto = vagasLei.QPBM[posto as keyof typeof vagasLei.QPBM] || 0;
          const vagasOcupadas = contagem["QPBM"][posto] || 0;
          const vagasDisponiveis = Math.max(0, vagasLeiPosto - vagasOcupadas);
          
          dadosQFV.QPBM.push({
            posto,
            vagasLei: vagasLeiPosto,
            vagasOcupadas,
            vagasDisponiveis
          });
          
          // Atualizar totais
          totaisTemp.QPBM.vagasLei += vagasLeiPosto;
          totaisTemp.QPBM.vagasOcupadas += vagasOcupadas;
          totaisTemp.QPBM.vagasDisponiveis += vagasDisponiveis;
        });
        
        // Para os quadros de reserva, mostrar apenas a contagem
        // QORR
        let totalReservaQORR = 0;
        const postosQORR = Object.keys(contagemReserva["QORR"] || {});
        postosQORR.forEach(posto => {
          const vagasOcupadas = contagemReserva["QORR"][posto] || 0;
          totalReservaQORR += vagasOcupadas;
          
          dadosQFV.QORR.push({
            posto,
            vagasLei: 0, // Sem limite na reserva
            vagasOcupadas,
            vagasDisponiveis: 0
          });
        });
        
        // QPRR
        let totalReservaQPRR = 0;
        const postosQPRR = Object.keys(contagemReserva["QPRR"] || {});
        postosQPRR.forEach(posto => {
          const vagasOcupadas = contagemReserva["QPRR"][posto] || 0;
          totalReservaQPRR += vagasOcupadas;
          
          dadosQFV.QPRR.push({
            posto,
            vagasLei: 0, // Sem limite na reserva
            vagasOcupadas,
            vagasDisponiveis: 0
          });
        });
        
        // Atualizar totais para quadros de reserva
        totaisTemp.QORR.vagasOcupadas = totalReservaQORR;
        totaisTemp.QPRR.vagasOcupadas = totalReservaQPRR;
        
        setQFVData(dadosQFV);
        setTotais(totaisTemp);
        
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
  
  // Função para renderizar a tabela do QFV
  const renderTabelaQFV = (quadro: QuadroMilitar) => {
    const dados = [...qfvData[quadro]].sort(ordenarPostos);
    
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posto/Graduação</TableHead>
              <TableHead className="text-center">Vagas pela Lei nº 7.772/2022</TableHead>
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
            
            {/* Linha de total para quadros ativos */}
            {quadro !== "QORR" && quadro !== "QPRR" && totais[quadro] && (
              <TableRow className="bg-gray-100 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-center">{totais[quadro].vagasLei}</TableCell>
                <TableCell className="text-center">{totais[quadro].vagasOcupadas}</TableCell>
                <TableCell className="text-center">{totais[quadro].vagasDisponiveis}</TableCell>
              </TableRow>
            )}
            
            {/* Linha de total para quadros de reserva */}
            {(quadro === "QORR" || quadro === "QPRR") && totais[quadro] && dados.length > 0 && (
              <TableRow className="bg-gray-100 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-center">N/A</TableCell>
                <TableCell className="text-center">{totais[quadro].vagasOcupadas}</TableCell>
                <TableCell className="text-center">N/A</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Função para baixar dados como CSV
  const exportarDadosCSV = () => {
    let csvContent = "Quadro;Posto;Vagas pela Lei;Vagas Ocupadas;Vagas Disponíveis\r\n";
    
    Object.keys(qfvData).forEach(quadro => {
      const dados = [...qfvData[quadro as QuadroMilitar]].sort(ordenarPostos);
      dados.forEach(item => {
        const vagasLeiValue = (quadro === "QORR" || quadro === "QPRR") ? "N/A" : item.vagasLei;
        const vagasDisponiveisValue = (quadro === "QORR" || quadro === "QPRR") ? "N/A" : item.vagasDisponiveis;
        
        csvContent += `${quadro};${item.posto};${vagasLeiValue};${item.vagasOcupadas};${vagasDisponiveisValue}\r\n`;
      });
      
      // Adicionar linha de totais
      if (quadro !== "QORR" && quadro !== "QPRR" && totais[quadro]) {
        csvContent += `${quadro};TOTAL;${totais[quadro].vagasLei};${totais[quadro].vagasOcupadas};${totais[quadro].vagasDisponiveis}\r\n`;
      } else if ((quadro === "QORR" || quadro === "QPRR") && totais[quadro]) {
        csvContent += `${quadro};TOTAL;N/A;${totais[quadro].vagasOcupadas};N/A\r\n`;
      }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `quadro_fixacao_vagas_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV) - Lei nº 7.772/2022</h1>
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
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="bg-blue-600 text-white py-3">
            <CardTitle className="text-center">Oficiais</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{totais.QOEM?.vagasLei + totais.QOE?.vagasLei || 0}</div>
              <div className="text-sm text-gray-500">Vagas Totais pela Lei</div>
            </div>
            <div className="grid grid-cols-2 mt-4 gap-4">
              <div className="text-center p-3 bg-gray-100 rounded-md">
                <div className="text-lg font-bold">{totais.QOEM?.vagasOcupadas + totais.QOE?.vagasOcupadas || 0}</div>
                <div className="text-xs">Vagas Ocupadas</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-md">
                <div className="text-lg font-bold">{totais.QOEM?.vagasDisponiveis + totais.QOE?.vagasDisponiveis || 0}</div>
                <div className="text-xs">Vagas Disponíveis</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-red-600 text-white py-3">
            <CardTitle className="text-center">Praças</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{totais.QPBM?.vagasLei || 0}</div>
              <div className="text-sm text-gray-500">Vagas Totais pela Lei</div>
            </div>
            <div className="grid grid-cols-2 mt-4 gap-4">
              <div className="text-center p-3 bg-gray-100 rounded-md">
                <div className="text-lg font-bold">{totais.QPBM?.vagasOcupadas || 0}</div>
                <div className="text-xs">Vagas Ocupadas</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-md">
                <div className="text-lg font-bold">{totais.QPBM?.vagasDisponiveis || 0}</div>
                <div className="text-xs">Vagas Disponíveis</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-green-600 text-white py-3">
            <CardTitle className="text-center">Reserva</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{totais.QORR?.vagasOcupadas + totais.QPRR?.vagasOcupadas || 0}</div>
              <div className="text-sm text-gray-500">Total na Reserva</div>
            </div>
            <div className="grid grid-cols-2 mt-4 gap-4">
              <div className="text-center p-3 bg-gray-100 rounded-md">
                <div className="text-lg font-bold">{totais.QORR?.vagasOcupadas || 0}</div>
                <div className="text-xs">Oficiais (QORR)</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-md">
                <div className="text-lg font-bold">{totais.QPRR?.vagasOcupadas || 0}</div>
                <div className="text-xs">Praças (QPRR)</div>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="QOEM">Estado-Maior</TabsTrigger>
                <TabsTrigger value="QOE">Especialistas</TabsTrigger>
                <TabsTrigger value="QORR">Oficiais Reserva</TabsTrigger>
                <TabsTrigger value="QPBM">Praças Ativos</TabsTrigger>
                <TabsTrigger value="QPRR">Praças Reserva</TabsTrigger>
              </TabsList>
              
              <TabsContent value="QOEM" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais do Estado-Maior (QOEM)</h2>
                {renderTabelaQFV("QOEM")}
              </TabsContent>
              
              <TabsContent value="QOE" className="space-y-4">
                <h2 className="text-lg font-semibold">Quadro de Oficiais Especialistas (QOE)</h2>
                {renderTabelaQFV("QOE")}
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
    </div>
  );
};

export default QuadroFixacaoVagas;
