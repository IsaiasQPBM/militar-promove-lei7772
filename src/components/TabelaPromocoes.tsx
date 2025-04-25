
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PrevisaoPromocao } from "@/utils/promocaoUtils";
import { getBadgeVariant } from "@/utils/promocaoUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TabelaPromocoesProps {
  previsoes: PrevisaoPromocao[];
  onPromover: (previsao: PrevisaoPromocao) => void;
}

const TabelaPromocoes: React.FC<TabelaPromocoesProps> = ({ previsoes, onPromover }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Posto Atual</TableHead>
          <TableHead>Próximo Posto</TableHead>
          <TableHead>Data Última Promoção</TableHead>
          <TableHead>Data Prevista</TableHead>
          <TableHead>Tempo Restante</TableHead>
          <TableHead>Critério</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {previsoes.map((previsao) => (
          <TableRow key={previsao.militarId}>
            <TableCell className="font-medium">{previsao.nome}</TableCell>
            <TableCell>{previsao.posto}</TableCell>
            <TableCell>{previsao.proximoPosto}</TableCell>
            <TableCell>
              {format(previsao.dataUltimaPromocao, "dd/MM/yyyy", { locale: ptBR })}
            </TableCell>
            <TableCell>
              {previsao.dataProximaPromocao 
                ? format(previsao.dataProximaPromocao, "dd/MM/yyyy", { locale: ptBR }) 
                : "N/A"}
            </TableCell>
            <TableCell>
              <Badge className={getBadgeVariant(previsao.tempoRestante)}>
                {previsao.tempoRestante}
              </Badge>
            </TableCell>
            <TableCell>{previsao.criterio}</TableCell>
            <TableCell>
              {previsao.tempoRestante === "Promoção disponível" && (
                <Button 
                  size="sm" 
                  className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                  onClick={() => onPromover(previsao)}
                >
                  Promover
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TabelaPromocoes;
