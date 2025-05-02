
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQFVData } from "@/hooks/useQFVData";
import QFVTabela from "@/components/qfv/QFVTabela";
import QFVResumo from "@/components/qfv/QFVResumo";
import QFVExport from "@/components/qfv/QFVExport";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";

const QuadroFixacaoVagas = () => {
  const { qfvData, loading } = useQFVData();
  const [activeTab, setActiveTab] = useState<string>("QOEM");

  // Mapeia os quadros para seus títulos completos
  const quadroTitulos: Record<string, string> = {
    "QOEM": "Quadro de Oficiais Bombeiros Militar Combatentes (QOEM)",
    "QOE": "Quadro de Oficiais Especialistas (QOE)",
    "QOBM-S": "Quadro de Oficiais Bombeiros Militar de Saúde (QOBM-S)",
    "QOBM-E": "Quadro de Oficiais Bombeiros Militar Engenheiros (QOBM-E)",
    "QOBM-C": "Quadro de Oficiais Bombeiros Militar Complementares (QOBM-C)",
    "QORR": "Quadro de Oficiais da Reserva Remunerada (QORR)",
    "QPBM": "Quadro de Praças Bombeiros Militares (QPBM)",
    "QPRR": "Quadro de Praças da Reserva Remunerada (QPRR)"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV)</h1>
        <QFVExport qfvData={qfvData} />
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
              
              {Object.keys(quadroTitulos).map(quadro => (
                <TabsContent key={quadro} value={quadro} className="space-y-4">
                  <h2 className="text-lg font-semibold">{quadroTitulos[quadro]}</h2>
                  <QFVTabela 
                    dados={qfvData[quadro]} 
                    isReservaQuadro={quadro === "QORR" || quadro === "QPRR"}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Tabela de resumo */}
      <QFVResumo qfvData={qfvData} loading={loading} />
    </div>
  );
};

export default QuadroFixacaoVagas;
