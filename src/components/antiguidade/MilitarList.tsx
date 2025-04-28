
import { Militar } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MilitarListProps = {
  militares: Militar[];
  loading: boolean;
  tipo: "oficiais" | "pracas";
};

export const MilitarList = ({ militares, loading, tipo }: MilitarListProps) => {
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
          <TableHead>Data de Inclusão</TableHead>
          <TableHead>Última Promoção</TableHead>
          <TableHead>Idade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {militares.length > 0 ? (
          militares.map((militar, index) => (
            <TableRow key={militar.id}>
              <TableCell className="font-medium">{index + 1}º</TableCell>
              <TableCell>{militar.posto}</TableCell>
              <TableCell>{militar.nomeCompleto}</TableCell>
              <TableCell>
                {format(new Date(militar.dataInclusao), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {format(new Date(militar.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {new Date().getFullYear() - new Date(militar.dataNascimento).getFullYear()} anos
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              {tipo === "oficiais" ? "Não há oficiais cadastrados." : "Não há praças cadastradas."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
