
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
  const [qfvData, setQFVData] = useState<Record<QuadroMilitar, QFVData[]>>({
    QOEM: [],
    QOE: [],
    QORR: [],
    QPBM: [],
    QPRR: []
  });
  const [activeTab, setActiveTab] = useState<string>("QOEM");
  const [loading, setLoading] = useState(true);

  // Dados da Lei nº 7.772/2022 (simulados)
  const vagasLei = {
    QOEM: {
      "Coronel": 1,
      "Tenente-Coronel": 2,
      "Major": 3,
      "Capitão": 5,
      "1º Tenente": 7,
      "2º Tenente": 10
    },
    QOE: {
      "Coronel": 0,
      "Tenente-Coronel": 1,
      "Major": 2,
      "Capitão": 3,
      "1º Tenente": 5,
      "2º Tenente": 8
    },
    QPBM: {
      "Subtenente": 8,
      "1º Sargento": 15,
      "2º Sargento": 20,
      "3º Sargento": 30,
      "Cabo": 40,
      "Soldado": 60
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
        const dadosQFV: Record<QuadroMilitar, QFVData[]> = {
          QOEM: [],
          QOE: [],
          QORR: [],
          QPBM: [],
          QPRR: []
        };
        
        // QOEM
        Object.keys(vagasLei.QOEM).forEach(posto => {
          const vagasLeiPosto = vagasLei.QOEM[posto as keyof typeof vagasLei.QOEM] || 0;
          const vagasOcupadas = contagem["QOEM"][posto] || 0;
          
          dadosQFV.QOEM.push({
            posto,
            vagasLei: vagasLeiPosto,
            vagasOcupadas,
            vagasDisponiveis: Math.max(0, vagasLeiPosto - vagasOcupadas)
          });
        });
        
        // QOE
        Object.keys(vagasLei.QOE).forEach(posto => {
          const vagasLeiPosto = vagasLei.QOE[posto as keyof typeof vagasLei.QOE] || 0;
          const vagasOcupadas = contagem["QOE"][posto] || 0;
          
          dadosQFV.QOE.push({
            posto,
            vagasLei: vagasLeiPosto,
            vagasOcupadas,
            vagasDisponiveis: Math.max(0, vagasLeiPosto - vagasOcupadas)
          });
        });
        
        // QPBM
        Object.keys(vagasLei.QPBM).forEach(posto => {
          const vagasLeiPosto = vagasLei.QPBM[posto as keyof typeof vagasLei.QPBM] || 0;
          const vagasOcupadas = contagem["QPBM"][posto] || 0;
          
          dadosQFV.QPBM.push({
            posto,
            vagasLei: vagasLeiPosto,
            vagasOcupadas,
            vagasDisponiveis: Math.max(0, vagasLeiPosto - vagasOcupadas)
          });
        });
        
        // Para os quadros de reserva, mostrar apenas a contagem
        // QORR
        const postosQORR = Object.keys(contagem["QORR"] || {});
        postosQORR.forEach(posto => {
          const vagasOcupadas = contagem["QORR"][posto] || 0;
          
          dadosQFV.QORR.push({
            posto,
            vagasLei: 0, // Sem limite na reserva
            vagasOcupadas,
            vagasDisponiveis: 0
          });
        });
        
        // QPRR
        const postosQPRR = Object.keys(contagem["QPRR"] || {});
        postosQPRR.forEach(posto => {
          const vagasOcupadas = contagem["QPRR"][posto] || 0;
          
          dadosQFV.QPRR.push({
            posto,
            vagasLei: 0, // Sem limite na reserva
            vagasOcupadas,
            vagasDisponiveis: 0
          });
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
            onClick={() => {
              // Funcionalidade para exportar os dados
              toast({
                title: "Exportação não implementada",
                description: "A funcionalidade de exportação será implementada em uma versão futura."
              });
            }}
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
