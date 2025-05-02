
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QFVDataByQuadro } from "@/types/qfv";
import { useQuadroTitulos } from "./useQuadroTitulos";
import QFVTabela from "./QFVTabela";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";

interface QFVContentProps {
  qfvData: QFVDataByQuadro;
  activeTab: string;
  setActiveTab: (value: string) => void;
  loading: boolean;
}

const QFVContent = ({ qfvData, activeTab, setActiveTab, loading }: QFVContentProps) => {
  const quadroTitulos = useQuadroTitulos();

  return (
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
  );
};

export default QFVContent;
