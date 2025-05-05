
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PrevisaoPromocao, getBadgeVariant } from "@/utils/promocaoUtils";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TabelaPromocoesProps {
  previsoes: PrevisaoPromocao[];
}

const TabelaPromocoes = ({ previsoes }: TabelaPromocoesProps) => {
  const navigate = useNavigate();

  const visualizarFicha = (id: string) => {
    navigate(`/ficha-militar/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posto/Grad</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Data Última Promoção</TableHead>
            <TableHead>Próximo Posto/Grad</TableHead>
            <TableHead>Data Possível Promoção</TableHead>
            <TableHead>Tempo Restante</TableHead>
            <TableHead>Critério</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {previsoes.map((previsao) => (
            <TableRow key={previsao.militarId}>
              <TableCell>{previsao.posto}</TableCell>
              <TableCell className="font-medium">{previsao.nome}</TableCell>
              <TableCell>
                {format(previsao.dataUltimaPromocao, "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>{previsao.proximoPosto}</TableCell>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => visualizarFicha(previsao.militarId)}>
                      Visualizar Ficha
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TabelaPromocoes;
