
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QFVData } from "@/types/qfv";

interface QFVTabelaProps {
  dados: QFVData[];
  isReservaQuadro?: boolean;
}

const QFVTabela = ({ dados, isReservaQuadro = false }: QFVTabelaProps) => {
  // Função para ordenar os postos corretamente
  const ordenarPostos = (a: QFVData, b: QFVData) => {
    const ordemPostos = [
      "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
      "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
    ];
    
    return ordemPostos.indexOf(a.posto) - ordemPostos.indexOf(b.posto);
  };

  const dadosOrdenados = [...dados].sort(ordenarPostos);

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
          {dadosOrdenados.length > 0 ? (
            dadosOrdenados.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.posto}</TableCell>
                <TableCell className="text-center">
                  {isReservaQuadro ? "N/A" : item.vagasLei}
                </TableCell>
                <TableCell className="text-center">{item.vagasOcupadas}</TableCell>
                <TableCell className="text-center">
                  {isReservaQuadro ? "N/A" : item.vagasDisponiveis}
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
          {!isReservaQuadro && dadosOrdenados.length > 0 && (
            <TableRow className="bg-gray-50 font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-center">
                {dadosOrdenados.reduce((sum, item) => sum + item.vagasLei, 0)}
              </TableCell>
              <TableCell className="text-center">
                {dadosOrdenados.reduce((sum, item) => sum + item.vagasOcupadas, 0)}
              </TableCell>
              <TableCell className="text-center">
                {dadosOrdenados.reduce((sum, item) => sum + item.vagasDisponiveis, 0)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QFVTabela;
