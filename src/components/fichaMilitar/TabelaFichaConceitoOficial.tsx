
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PontuacaoLei5461 } from "@/types";
import { obterCriteriosLei5461 } from "@/services/promocaoService";

interface TabelaFichaConceitoOficialProps {
  militarId: string;
  pontuacao: PontuacaoLei5461;
  onPontuacaoChange: (pontuacao: PontuacaoLei5461) => void;
}

export function TabelaFichaConceitoOficial({
  militarId,
  pontuacao,
  onPontuacaoChange
}: TabelaFichaConceitoOficialProps) {
  const criterios = obterCriteriosLei5461();
  
  // Função para atualizar a quantidade em um item específico
  const atualizarQuantidade = (
    categoria: keyof PontuacaoLei5461, 
    item: string, 
    novaQuantidade: number
  ) => {
    if (novaQuantidade < 0) novaQuantidade = 0;
    
    const novaPontuacao = { ...pontuacao };
    let categoriaAtual: any = novaPontuacao[categoria];
    
    if (categoria === "tempoServicoQuadro") {
      categoriaAtual.quantidade = novaQuantidade;
      categoriaAtual.pontosPositivos = novaQuantidade * categoriaAtual.valor;
    } 
    else if (
      categoria === "cursosMilitares" || 
      categoria === "cursosCivis" || 
      categoria === "condecoracoes" || 
      categoria === "elogios" || 
      categoria === "punicoes"
    ) {
      categoriaAtual[item].quantidade = novaQuantidade;
      
      if (categoria === "punicoes") {
        categoriaAtual[item].pontosNegativos = novaQuantidade * Math.abs(categoriaAtual[item].valor);
      } else {
        categoriaAtual[item].pontosPositivos = novaQuantidade * categoriaAtual[item].valor;
      }
    }
    
    // Recalcular o total
    calcularSomaTotal(novaPontuacao);
    
    // Atualizar estado
    onPontuacaoChange(novaPontuacao);
  };
  
  // Função para calcular a soma total de pontos
  const calcularSomaTotal = (pontuacaoAtual: PontuacaoLei5461) => {
    let total = 0;
    
    // Tempo de serviço
    total += pontuacaoAtual.tempoServicoQuadro.pontosPositivos;
    
    // Cursos Militares
    Object.values(pontuacaoAtual.cursosMilitares).forEach(item => {
      total += item.pontosPositivos;
    });
    
    // Cursos Civis
    Object.values(pontuacaoAtual.cursosCivis).forEach(item => {
      total += item.pontosPositivos;
    });
    
    // Condecorações
    Object.values(pontuacaoAtual.condecoracoes).forEach(item => {
      total += item.pontosPositivos;
    });
    
    // Elogios
    Object.values(pontuacaoAtual.elogios).forEach(item => {
      total += item.pontosPositivos;
    });
    
    // Punições (são pontos negativos)
    Object.values(pontuacaoAtual.punicoes).forEach(item => {
      if (item.pontosNegativos) {
        total -= item.pontosNegativos;
      }
    });
    
    // Falta de aproveitamento
    if (pontuacaoAtual.faltaAproveitamentoCursos.pontosNegativos) {
      total -= pontuacaoAtual.faltaAproveitamentoCursos.pontosNegativos;
    }
    
    pontuacaoAtual.somaTotal = total;
    return total;
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Critério</TableHead>
            <TableHead className="w-[25%]">Valor por Item</TableHead>
            <TableHead className="w-[20%]">Quantidade</TableHead>
            <TableHead className="w-[25%] text-right">Pontos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Tempo de Serviço */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Tempo de Serviço no Quadro</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tempo no quadro (meses)</TableCell>
            <TableCell>0,1 por mês</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.tempoServicoQuadro.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "tempoServicoQuadro", 
                  "", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.tempoServicoQuadro.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          
          {/* Cursos Militares */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Cursos Militares</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Especialização</TableCell>
            <TableCell>0,5 por curso (máx. 2,0)</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.cursosMilitares.especializacao.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "especializacao", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.especializacao.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CSBM</TableCell>
            <TableCell>4,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.csbm.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "csbm", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.csbm.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CFSD</TableCell>
            <TableCell>3,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.cfsd.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "cfsd", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.cfsd.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CHC</TableCell>
            <TableCell>1,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.chc.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "chc", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.chc.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CHSGT</TableCell>
            <TableCell>1,5</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.chsgt.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "chsgt", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.chsgt.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CAS</TableCell>
            <TableCell>2,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.cas.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "cas", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.cas.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CHO</TableCell>
            <TableCell>2,5</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.cho.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "cho", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.cho.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CFO</TableCell>
            <TableCell>4,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.cfo.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "cfo", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.cfo.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CAO</TableCell>
            <TableCell>3,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.cao.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "cao", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.cao.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CSBM2</TableCell>
            <TableCell>3,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosMilitares.csbm2.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosMilitares", 
                  "csbm2", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosMilitares.csbm2.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          
          {/* Cursos Civis */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Cursos Civis</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Superior</TableCell>
            <TableCell>1,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosCivis.superior.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosCivis", 
                  "superior", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosCivis.superior.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Especialização</TableCell>
            <TableCell>1,0 por curso (máx. 3,0)</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="3" 
                value={pontuacao.cursosCivis.especializacao.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosCivis", 
                  "especializacao", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosCivis.especializacao.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mestrado</TableCell>
            <TableCell>2,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosCivis.mestrado.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosCivis", 
                  "mestrado", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosCivis.mestrado.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Doutorado</TableCell>
            <TableCell>3,0</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                value={pontuacao.cursosCivis.doutorado.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "cursosCivis", 
                  "doutorado", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.cursosCivis.doutorado.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          
          {/* Condecorações */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Condecorações</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Governo Federal</TableCell>
            <TableCell>1,0 por condecoração</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.condecoracoes.governoFederal.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "condecoracoes", 
                  "governoFederal", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.condecoracoes.governoFederal.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Governo Estadual</TableCell>
            <TableCell>0,5 por condecoração</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.condecoracoes.governoEstadual.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "condecoracoes", 
                  "governoEstadual", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.condecoracoes.governoEstadual.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CBMEPI</TableCell>
            <TableCell>0,2 por condecoração</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.condecoracoes.cbmepi.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "condecoracoes", 
                  "cbmepi", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.condecoracoes.cbmepi.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          
          {/* Elogios */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Elogios</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Individual</TableCell>
            <TableCell>0,2 por elogio</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.elogios.individual.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "elogios", 
                  "individual", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.elogios.individual.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coletivo</TableCell>
            <TableCell>0,1 por elogio</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.elogios.coletivo.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "elogios", 
                  "coletivo", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right">{pontuacao.elogios.coletivo.pontosPositivos.toFixed(1)}</TableCell>
          </TableRow>
          
          {/* Punições */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Punições</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Repreensão</TableCell>
            <TableCell>-0,5 por punição</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.punicoes.repreensao.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "punicoes", 
                  "repreensao", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right text-red-600">-{pontuacao.punicoes.repreensao.pontosNegativos?.toFixed(1) || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Detenção</TableCell>
            <TableCell>-1,0 por punição</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.punicoes.detencao.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "punicoes", 
                  "detencao", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right text-red-600">-{pontuacao.punicoes.detencao.pontosNegativos?.toFixed(1) || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Prisão</TableCell>
            <TableCell>-1,5 por punição</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.punicoes.prisao.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "punicoes", 
                  "prisao", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right text-red-600">-{pontuacao.punicoes.prisao.pontosNegativos?.toFixed(1) || 0}</TableCell>
          </TableRow>
          
          {/* Falta de Aproveitamento em Cursos */}
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4}>Falta de Aproveitamento em Cursos</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Reprovação por Desempenho</TableCell>
            <TableCell>-1,0 por curso</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                value={pontuacao.faltaAproveitamentoCursos.quantidade}
                onChange={(e) => atualizarQuantidade(
                  "faltaAproveitamentoCursos", 
                  "", 
                  parseInt(e.target.value) || 0
                )}
                className="w-20"
              />
            </TableCell>
            <TableCell className="text-right text-red-600">-{pontuacao.faltaAproveitamentoCursos.pontosNegativos?.toFixed(1) || 0}</TableCell>
          </TableRow>
          
          {/* Total */}
          <TableRow className="border-t-2 border-black font-bold text-lg">
            <TableCell colSpan={3}>TOTAL DE PONTOS</TableCell>
            <TableCell className="text-right">{pontuacao.somaTotal.toFixed(1)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
