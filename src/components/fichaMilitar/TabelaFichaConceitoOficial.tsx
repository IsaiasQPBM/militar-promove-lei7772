
import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PontuacaoLei5461 } from "@/types";

interface TabelaFichaConceitoOficialProps {
  militarId: string;
  pontuacao: PontuacaoLei5461;
  onPontuacaoChange: (novaPontuacao: PontuacaoLei5461) => void;
}

export const TabelaFichaConceitoOficial = ({ 
  militarId,
  pontuacao,
  onPontuacaoChange
}: TabelaFichaConceitoOficialProps) => {
  // Estado para controlar o tempo de serviço no quadro (em meses)
  const [tempoServicoQuadro, setTempoServicoQuadro] = useState<number>(
    pontuacao.tempoServicoQuadro.quantidade || 0
  );

  // Calcular pontos por tempo de serviço (0.1 ponto por mês)
  const calcularPontosPorTempo = useCallback((meses: number) => {
    return meses * 0.1;
  }, []);

  // Atualizar a pontuação quando o tempo de serviço mudar
  useEffect(() => {
    if (pontuacao) {
      const novaPontuacao = { ...pontuacao };
      
      // Atualizar tempo de serviço
      novaPontuacao.tempoServicoQuadro = {
        quantidade: tempoServicoQuadro,
        valor: 0.1,
        pontosPositivos: calcularPontosPorTempo(tempoServicoQuadro),
        pontosNegativos: 0
      };
      
      // Recalcular soma total
      let total = calcularPontosPorTempo(tempoServicoQuadro);
      
      // Adicionar outros pontos positivos
      // Cursos Militares
      Object.values(novaPontuacao.cursosMilitares).forEach(item => {
        total += item.pontosPositivos;
      });
      
      // Cursos Civis
      Object.values(novaPontuacao.cursosCivis).forEach(item => {
        total += item.pontosPositivos;
      });
      
      // Condecorações
      Object.values(novaPontuacao.condecoracoes).forEach(item => {
        total += item.pontosPositivos;
      });
      
      // Elogios
      Object.values(novaPontuacao.elogios).forEach(item => {
        total += item.pontosPositivos;
      });
      
      // Subtrair pontos negativos
      // Punições
      Object.values(novaPontuacao.punicoes).forEach(item => {
        total -= item.pontosNegativos || 0;
      });
      
      // Falta de aproveitamento em cursos
      total -= novaPontuacao.faltaAproveitamentoCursos.pontosNegativos || 0;
      
      novaPontuacao.somaTotal = total;
      
      // Notificar a alteração da pontuação
      onPontuacaoChange(novaPontuacao);
    }
  }, [tempoServicoQuadro, pontuacao, calcularPontosPorTempo, onPontuacaoChange]);
  
  return (
    <div className="space-y-6">
      {/* Tempo de Serviço no Quadro */}
      <div className="space-y-2">
        <Label htmlFor="tempoServicoQuadro">
          Tempo de Serviço no Quadro (meses)
        </Label>
        <Input
          id="tempoServicoQuadro"
          type="number"
          min="0"
          value={tempoServicoQuadro}
          onChange={(e) => setTempoServicoQuadro(Number(e.target.value))}
          className="max-w-xs"
        />
      </div>
      
      {/* Tabela de Pontuação */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-1/3">Item</TableHead>
              <TableHead className="text-center w-1/5">Quantidade</TableHead>
              <TableHead className="text-center w-1/5">Valor Unitário</TableHead>
              <TableHead className="text-center w-1/5">Total Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Tempo de Serviço no Quadro */}
            <TableRow>
              <TableCell className="font-medium">Tempo de Serviço (meses)</TableCell>
              <TableCell className="text-center">{pontuacao.tempoServicoQuadro.quantidade || 0}</TableCell>
              <TableCell className="text-center">0,10</TableCell>
              <TableCell className="text-center">{pontuacao.tempoServicoQuadro.pontosPositivos.toFixed(2)}</TableCell>
            </TableRow>
            
            {/* Cursos Militares */}
            <TableRow className="bg-gray-100">
              <TableCell colSpan={4} className="font-bold">Cursos Militares</TableCell>
            </TableRow>
            {Object.entries(pontuacao.cursosMilitares).map(([key, item]) => (
              item.quantidade > 0 && (
                <TableRow key={`cm-${key}`}>
                  <TableCell className="font-medium">
                    {key === 'especializacao' ? 'Especialização' :
                     key === 'csbm' ? 'CSBM' : 
                     key === 'cfsd' ? 'CFSD' :
                     key === 'chc' ? 'CHC' :
                     key === 'chsgt' ? 'CHSGT' :
                     key === 'cas' ? 'CAS' :
                     key === 'cho' ? 'CHO' :
                     key === 'cfo' ? 'CFO' :
                     key === 'cao' ? 'CAO' :
                     key === 'csbm2' ? 'CSBM2' : key}
                  </TableCell>
                  <TableCell className="text-center">{item.quantidade}</TableCell>
                  <TableCell className="text-center">Variável</TableCell>
                  <TableCell className="text-center">{item.pontosPositivos.toFixed(2)}</TableCell>
                </TableRow>
              )
            ))}
            
            {/* Cursos Civis */}
            <TableRow className="bg-gray-100">
              <TableCell colSpan={4} className="font-bold">Cursos Civis</TableCell>
            </TableRow>
            {Object.entries(pontuacao.cursosCivis).map(([key, item]) => (
              item.quantidade > 0 && (
                <TableRow key={`cc-${key}`}>
                  <TableCell className="font-medium">
                    {key === 'superior' ? 'Superior' :
                     key === 'especializacao' ? 'Especialização' :
                     key === 'mestrado' ? 'Mestrado' :
                     key === 'doutorado' ? 'Doutorado' : key}
                  </TableCell>
                  <TableCell className="text-center">{item.quantidade}</TableCell>
                  <TableCell className="text-center">Variável</TableCell>
                  <TableCell className="text-center">{item.pontosPositivos.toFixed(2)}</TableCell>
                </TableRow>
              )
            ))}
            
            {/* Condecorações */}
            <TableRow className="bg-gray-100">
              <TableCell colSpan={4} className="font-bold">Condecorações</TableCell>
            </TableRow>
            {Object.entries(pontuacao.condecoracoes).map(([key, item]) => (
              item.quantidade > 0 && (
                <TableRow key={`cond-${key}`}>
                  <TableCell className="font-medium">
                    {key === 'governoFederal' ? 'Governo Federal' :
                     key === 'governoEstadual' ? 'Governo Estadual' :
                     key === 'cbmepi' ? 'CBMEPI' : key}
                  </TableCell>
                  <TableCell className="text-center">{item.quantidade}</TableCell>
                  <TableCell className="text-center">Variável</TableCell>
                  <TableCell className="text-center">{item.pontosPositivos.toFixed(2)}</TableCell>
                </TableRow>
              )
            ))}
            
            {/* Elogios */}
            <TableRow className="bg-gray-100">
              <TableCell colSpan={4} className="font-bold">Elogios</TableCell>
            </TableRow>
            {Object.entries(pontuacao.elogios).map(([key, item]) => (
              item.quantidade > 0 && (
                <TableRow key={`elog-${key}`}>
                  <TableCell className="font-medium">
                    {key === 'individual' ? 'Individual' :
                     key === 'coletivo' ? 'Coletivo' : key}
                  </TableCell>
                  <TableCell className="text-center">{item.quantidade}</TableCell>
                  <TableCell className="text-center">Variável</TableCell>
                  <TableCell className="text-center">{item.pontosPositivos.toFixed(2)}</TableCell>
                </TableRow>
              )
            ))}
            
            {/* Punições */}
            {(pontuacao.punicoes.repreensao.quantidade > 0 ||
              pontuacao.punicoes.detencao.quantidade > 0 ||
              pontuacao.punicoes.prisao.quantidade > 0) && (
              <>
                <TableRow className="bg-gray-100">
                  <TableCell colSpan={4} className="font-bold">Punições</TableCell>
                </TableRow>
                {Object.entries(pontuacao.punicoes).map(([key, item]) => (
                  item.quantidade > 0 && (
                    <TableRow key={`pun-${key}`} className="bg-red-50">
                      <TableCell className="font-medium">
                        {key === 'repreensao' ? 'Repreensão' :
                         key === 'detencao' ? 'Detenção' :
                         key === 'prisao' ? 'Prisão' : key}
                      </TableCell>
                      <TableCell className="text-center">{item.quantidade}</TableCell>
                      <TableCell className="text-center">Variável</TableCell>
                      <TableCell className="text-center text-red-600">-{item.pontosNegativos?.toFixed(2) || 0}</TableCell>
                    </TableRow>
                  )
                ))}
              </>
            )}
            
            {/* Total */}
            <TableRow className="bg-gray-200 font-bold">
              <TableCell colSpan={3} className="text-right">Total de Pontos</TableCell>
              <TableCell className="text-center">{pontuacao.somaTotal.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
