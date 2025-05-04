
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PontuacaoLei5461 } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { salvarFichaConceito } from "@/services/fichaService";

interface TabelaFichaConceitoOficialProps {
  militarId: string;
  pontuacao: PontuacaoLei5461;
  onPontuacaoChange: (novaPontuacao: PontuacaoLei5461) => void;
  readOnly?: boolean;
}

export const TabelaFichaConceitoOficial = ({ 
  militarId,
  pontuacao, 
  onPontuacaoChange,
  readOnly = false 
}: TabelaFichaConceitoOficialProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleQuantidadeChange = (
    category: keyof PontuacaoLei5461, 
    subcategory: string, 
    value: number
  ) => {
    const newPontuacao = { ...pontuacao };
    
    // @ts-ignore - Dynamic access
    if (newPontuacao[category] && newPontuacao[category][subcategory]) {
      // @ts-ignore - Dynamic access
      newPontuacao[category][subcategory].quantidade = value;
      
      // Calcular os pontos com base na quantidade e valor
      // @ts-ignore - Dynamic access
      const valorUnitario = newPontuacao[category][subcategory].valor;
      
      // @ts-ignore - Dynamic access
      if (category === "punicoes" || category === "faltaAproveitamentoCursos") {
        // Para pontos negativos
        // @ts-ignore - Dynamic access
        newPontuacao[category][subcategory].pontosNegativos = value * valorUnitario;
        // @ts-ignore - Dynamic access
        newPontuacao[category][subcategory].pontosPositivos = 0;
      } else {
        // Para pontos positivos
        // @ts-ignore - Dynamic access
        newPontuacao[category][subcategory].pontosPositivos = value * valorUnitario;
        // @ts-ignore - Dynamic access
        newPontuacao[category][subcategory].pontosNegativos = 0;
      }
      
      // Recalcular soma total
      let somaPositivos = 0;
      let somaNegativos = 0;
      
      // Tempo de serviço
      somaPositivos += newPontuacao.tempoServicoQuadro.pontosPositivos;
      
      // Cursos militares
      Object.values(newPontuacao.cursosMilitares).forEach(item => {
        somaPositivos += item.pontosPositivos;
      });
      
      // Cursos civis
      Object.values(newPontuacao.cursosCivis).forEach(item => {
        somaPositivos += item.pontosPositivos;
      });
      
      // Condecorações
      Object.values(newPontuacao.condecoracoes).forEach(item => {
        somaPositivos += item.pontosPositivos;
      });
      
      // Elogios
      Object.values(newPontuacao.elogios).forEach(item => {
        somaPositivos += item.pontosPositivos;
      });
      
      // Punições
      Object.values(newPontuacao.punicoes).forEach(item => {
        somaNegativos += item.pontosNegativos;
      });
      
      // Falta de aproveitamento
      somaNegativos += newPontuacao.faltaAproveitamentoCursos.pontosNegativos;
      
      // Atualizar soma total
      newPontuacao.somaTotal = somaPositivos - somaNegativos;
      
      onPontuacaoChange(newPontuacao);
    }
  };

  const handleSave = async () => {
    try {
      await salvarFichaConceito({
        militarId,
        tempoServicoQuadro: pontuacao.tempoServicoQuadro.quantidade,
        totalPontos: pontuacao.somaTotal
      });
      
      toast({
        title: "Pontuação salva com sucesso!",
        description: "A ficha de conceito do oficial foi atualizada."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar ficha de conceito:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a ficha de conceito.",
        variant: "destructive"
      });
    }
  };
  
  const maxValues = {
    tempoServicoQuadro: 5,
    cursosMilitares: 5,
    cursosCivis: 10,
    condecoracoes: 1,
    elogios: 0.25
  };
  
  const getRowClassName = (category: string) => {
    return category === "punicoes" || category === "faltaAproveitamentoCursos" 
      ? "bg-red-50" 
      : "";
  };
  
  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex justify-end">
          {isEditing ? (
            <div className="space-x-2">
              <Button onClick={handleSave} variant="default">
                Salvar
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Editar
            </Button>
          )}
        </div>
      )}
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border" colSpan={2}>
                <strong>Dados Apurados</strong>
              </TableHead>
              <TableHead className="border text-center">
                <strong>Quantidade</strong>
              </TableHead>
              <TableHead className="border text-center">
                <strong>Valor</strong>
              </TableHead>
              <TableHead className="border text-center" colSpan={2}>
                <strong>Pontos</strong>
              </TableHead>
              <TableHead className="border text-center">
                <strong>Observação</strong>
              </TableHead>
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableHead className="border"></TableHead>
              <TableHead className="border"></TableHead>
              <TableHead className="border"></TableHead>
              <TableHead className="border"></TableHead>
              <TableHead className="border text-center">
                <strong>POSITIVOS</strong>
              </TableHead>
              <TableHead className="border text-center">
                <strong>NEGATIVOS</strong>
              </TableHead>
              <TableHead className="border"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Tempo de Serviço no Quadro */}
            <TableRow>
              <TableCell className="border" rowSpan={1}>
                <strong>Tempo de Serviço no Quadro</strong>
              </TableCell>
              <TableCell className="border">No Posto atual</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.tempoServicoQuadro.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "tempoServicoQuadro", 
                      "quantidade",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.tempoServicoQuadro.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">
                {pontuacao.tempoServicoQuadro.valor.toFixed(2)}
              </TableCell>
              <TableCell className="border text-center">
                {pontuacao.tempoServicoQuadro.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border">
                Pontuação máxima 05 pontos
              </TableCell>
            </TableRow>
            
            {/* Conclusão de Cursos Militares */}
            <TableRow>
              <TableCell className="border" rowSpan={9}>
                <strong>Conclusão de Cursos Militares</strong>
              </TableCell>
              <TableCell className="border">Especialização</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.especializacao.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "especializacao",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.especializacao.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">2,50</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.especializacao.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border" rowSpan={9}>
                Pontuação máxima 05 pontos
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CSBM</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.csbm.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "csbm",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.csbm.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">4,00</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.csbm.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CFSD</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.cfsd.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "cfsd",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.cfsd.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,50</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.cfsd.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CHC ou adaptação a Cb</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.chc.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "chc",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.chc.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,75</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.chc.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CHSGT ou adaptação a Sgt</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.chsgt.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "chsgt",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.chsgt.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">1,00</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.chsgt.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CAS</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.cas.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "cas",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.cas.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">1,25</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.cas.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CHO</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.cho.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "cho",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.cho.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">1,50</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.cho.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CFO</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.cfo.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "cfo",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.cfo.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">1,75</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.cfo.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CAO</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.cao.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "cao",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.cao.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">3,00</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.cao.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">CSBM</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosMilitares.csbm2.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosMilitares",
                      "csbm2",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosMilitares.csbm2.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">2,50</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosMilitares.csbm2.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            
            {/* Instrutor em cursos militares */}
            <TableRow>
              <TableCell className="border" rowSpan={1}>
                <strong>Instrutor em cursos militares</strong>
              </TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border">
                Pontuação máxima 10 pontos
              </TableCell>
            </TableRow>
            
            {/* Conclusão em cursos civis */}
            <TableRow>
              <TableCell className="border" rowSpan={4}>
                <strong>Conclusão em cursos civis</strong>
              </TableCell>
              <TableCell className="border">Superior</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosCivis.superior.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosCivis",
                      "superior",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosCivis.superior.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">1,50</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosCivis.superior.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border" rowSpan={4}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">Especialização</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosCivis.especializacao.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosCivis",
                      "especializacao",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosCivis.especializacao.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">2,00</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosCivis.especializacao.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">Mestrado</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosCivis.mestrado.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosCivis",
                      "mestrado",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosCivis.mestrado.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">3,00</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosCivis.mestrado.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">Doutorado</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.cursosCivis.doutorado.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "cursosCivis",
                      "doutorado",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.cursosCivis.doutorado.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">4,00</TableCell>
              <TableCell className="border text-center">
                {pontuacao.cursosCivis.doutorado.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            
            {/* Medalhas e Condecorações */}
            <TableRow>
              <TableCell className="border" rowSpan={3}>
                <strong>Medalhas e Condecorações</strong>
              </TableCell>
              <TableCell className="border">Concedida pelo Governo Federal Reconhecido pelo CBMEPI</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.condecoracoes.governoFederal.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "condecoracoes",
                      "governoFederal",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.condecoracoes.governoFederal.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,50</TableCell>
              <TableCell className="border text-center">
                {pontuacao.condecoracoes.governoFederal.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border" rowSpan={3}>
                Pontuação máxima 1,0 ponto
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">Concedida pelo Governo Estadual Reconhecido Pelo CBMEPI</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.condecoracoes.governoEstadual.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "condecoracoes",
                      "governoEstadual",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.condecoracoes.governoEstadual.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,30</TableCell>
              <TableCell className="border text-center">
                {pontuacao.condecoracoes.governoEstadual.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">Concedida Pelo CBMEPI</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.condecoracoes.cbmepi.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "condecoracoes",
                      "cbmepi",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.condecoracoes.cbmepi.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,20</TableCell>
              <TableCell className="border text-center">
                {pontuacao.condecoracoes.cbmepi.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            
            {/* Elogios */}
            <TableRow>
              <TableCell className="border" rowSpan={2}>
                <strong>Elogios</strong>
              </TableCell>
              <TableCell className="border">Individual</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.elogios.individual.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "elogios",
                      "individual",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.elogios.individual.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,15</TableCell>
              <TableCell className="border text-center">
                {pontuacao.elogios.individual.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border" rowSpan={2}>
                Pontuação máxima 0,25 pontos
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border">Coletivo</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.elogios.coletivo.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "elogios",
                      "coletivo",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.elogios.coletivo.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,10</TableCell>
              <TableCell className="border text-center">
                {pontuacao.elogios.coletivo.pontosPositivos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            
            {/* Punições */}
            <TableRow className={getRowClassName("punicoes")}>
              <TableCell className="border" rowSpan={3}>
                <strong>Punições</strong>
              </TableCell>
              <TableCell className="border">Repreensão</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.punicoes.repreensao.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "punicoes",
                      "repreensao",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.punicoes.repreensao.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">0,50</TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border text-center">
                {pontuacao.punicoes.repreensao.pontosNegativos.toFixed(2)}
              </TableCell>
              <TableCell className="border" rowSpan={3}></TableCell>
            </TableRow>
            <TableRow className={getRowClassName("punicoes")}>
              <TableCell className="border">Detenção</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.punicoes.detencao.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "punicoes",
                      "detencao",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.punicoes.detencao.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">1,00</TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border text-center">
                {pontuacao.punicoes.detencao.pontosNegativos.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className={getRowClassName("punicoes")}>
              <TableCell className="border">Prisão</TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.punicoes.prisao.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "punicoes",
                      "prisao",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.punicoes.prisao.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">2,00</TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border text-center">
                {pontuacao.punicoes.prisao.pontosNegativos.toFixed(2)}
              </TableCell>
            </TableRow>
            
            {/* Falta de Aproveitamento em Cursos Militares */}
            <TableRow className={getRowClassName("faltaAproveitamentoCursos")}>
              <TableCell className="border" colSpan={2}>
                <strong>Falta de Aproveitamento em Cursos Militares</strong>
              </TableCell>
              <TableCell className="border p-0 text-center">
                {isEditing ? (
                  <Input
                    type="number"
                    value={pontuacao.faltaAproveitamentoCursos.quantidade}
                    onChange={(e) => handleQuantidadeChange(
                      "faltaAproveitamentoCursos",
                      "quantidade",
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-10 text-center border-0"
                  />
                ) : (
                  pontuacao.faltaAproveitamentoCursos.quantidade
                )}
              </TableCell>
              <TableCell className="border text-center">5,00</TableCell>
              <TableCell className="border"></TableCell>
              <TableCell className="border text-center">
                {pontuacao.faltaAproveitamentoCursos.pontosNegativos.toFixed(2)}
              </TableCell>
              <TableCell className="border"></TableCell>
            </TableRow>
            
            {/* Soma Total */}
            <TableRow className="bg-gray-100 font-bold">
              <TableCell className="border" colSpan={4}>
                <div className="text-center">SOMA TOTAL DE PONTOS</div>
              </TableCell>
              <TableCell className="border" colSpan={3}>
                <div className="text-center text-xl">{pontuacao.somaTotal.toFixed(2)}</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
