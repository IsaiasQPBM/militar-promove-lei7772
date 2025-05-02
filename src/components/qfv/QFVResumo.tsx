
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QFVData } from "@/types/qfv";

interface QFVResumoProps {
  qfvData: Record<string, QFVData[]>;
  loading: boolean;
}

const QFVResumo = ({ qfvData, loading }: QFVResumoProps) => {
  // Calcular totais para oficiais
  const totalOficiaisPrevistos = 329;
  
  const totalOficiaisExistentes = loading 
    ? "..." 
    : Object.entries(qfvData)
        .filter(([quadro]) => 
          quadro === "QOEM" || quadro === "QOE" || quadro === "QOBM-S" || 
          quadro === "QOBM-E" || quadro === "QOBM-C"
        )
        .reduce((total, [_, data]) => 
          total + data.reduce((sum, item) => sum + item.vagasOcupadas, 0), 0
        );
  
  const totalOficiaisDisponiveis = loading 
    ? "..." 
    : Object.entries(qfvData)
        .filter(([quadro]) => 
          quadro === "QOEM" || quadro === "QOE" || quadro === "QOBM-S" || 
          quadro === "QOBM-E" || quadro === "QOBM-C"
        )
        .reduce((total, [_, data]) => 
          total + data.reduce((sum, item) => sum + item.vagasDisponiveis, 0), 0
        );

  // Calcular totais para praças
  const totalPracasPrevistos = 1113;
  
  const totalPracasExistentes = loading 
    ? "..." 
    : (qfvData["QPBM"] || []).reduce((sum, item) => sum + item.vagasOcupadas, 0);
  
  const totalPracasDisponiveis = loading 
    ? "..." 
    : (qfvData["QPBM"] || []).reduce((sum, item) => sum + item.vagasDisponiveis, 0);

  // Calcular total geral
  const totalGeralPrevistos = totalOficiaisPrevistos + totalPracasPrevistos;
  
  const totalGeralExistentes = loading 
    ? "..." 
    : Object.entries(qfvData)
        .filter(([quadro]) => 
          quadro !== "QORR" && quadro !== "QPRR"
        )
        .reduce((total, [_, data]) => 
          total + data.reduce((sum, item) => sum + item.vagasOcupadas, 0), 0
        );
  
  const totalGeralDisponiveis = loading 
    ? "..." 
    : Object.entries(qfvData)
        .filter(([quadro]) => 
          quadro !== "QORR" && quadro !== "QPRR"
        )
        .reduce((total, [_, data]) => 
          total + data.reduce((sum, item) => sum + item.vagasDisponiveis, 0), 0
        );

  return (
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
                <TableCell className="text-center">{totalOficiaisPrevistos}</TableCell>
                <TableCell className="text-center">{totalOficiaisExistentes}</TableCell>
                <TableCell className="text-center">{totalOficiaisDisponiveis}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Praças</TableCell>
                <TableCell className="text-center">{totalPracasPrevistos}</TableCell>
                <TableCell className="text-center">{totalPracasExistentes}</TableCell>
                <TableCell className="text-center">{totalPracasDisponiveis}</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-center">{totalGeralPrevistos}</TableCell>
                <TableCell className="text-center">{totalGeralExistentes}</TableCell>
                <TableCell className="text-center">{totalGeralDisponiveis}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QFVResumo;
