
import { Militar } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MilitarComPontuacao = Militar & { pontuacao: number };

type MerecimentoListProps = {
  militares: MilitarComPontuacao[];
  loading: boolean;
  tipo: "oficiais" | "pracas";
};

export const MerecimentoList = ({ militares, loading, tipo }: MerecimentoListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Posição</TableHead>
          <TableHead>{tipo === "oficiais" ? "Posto" : "Graduação"}</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Pontuação Total</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {militares.length > 0 ? (
          militares.map((militar, index) => (
            <TableRow key={militar.id}>
              <TableCell className="font-medium">{index + 1}º</TableCell>
              <TableCell>{militar.posto}</TableCell>
              <TableCell>{militar.nomeCompleto}</TableCell>
              <TableCell className="font-bold">{militar.pontuacao.toFixed(2)}</TableCell>
              <TableCell>
                {index < 3 ? (
                  <Badge className="bg-green-600">Apto à promoção</Badge>
                ) : (
                  <Badge variant="outline">Não apto</Badge>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              {tipo === "oficiais" ? "Não há oficiais cadastrados." : "Não há praças cadastradas."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
