
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  mockMilitares, 
  mockCursosMilitares, 
  mockCursosCivis, 
  mockCondecoracoes, 
  mockElogios, 
  mockPunicoes 
} from "@/utils/mockData";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Merecimento = () => {
  const [tabValue, setTabValue] = useState("oficiais");
  
  // Calcula a pontuação de um militar pelo ID
  const calcularPontuacaoMilitar = (militarId: string): number => {
    // Pontos dos cursos militares
    const pontosCursosM = mockCursosMilitares
      .filter(curso => curso.militarId === militarId)
      .reduce((acc, curso) => acc + curso.pontos, 0);
    
    // Pontos dos cursos civis
    const pontosCursosC = mockCursosCivis
      .filter(curso => curso.militarId === militarId)
      .reduce((acc, curso) => acc + curso.pontos, 0);
    
    // Pontos das condecorações
    const pontosCondecoracoes = mockCondecoracoes
      .filter(cond => cond.militarId === militarId)
      .reduce((acc, cond) => acc + cond.pontos, 0);
    
    // Pontos dos elogios
    const pontosElogios = mockElogios
      .filter(elogio => elogio.militarId === militarId)
      .reduce((acc, elogio) => acc + elogio.pontos, 0);
    
    // Pontos negativos das punições
    const pontosPunicoes = mockPunicoes
      .filter(punicao => punicao.militarId === militarId)
      .reduce((acc, punicao) => acc + punicao.pontos, 0);
    
    // Total de pontos (positivos - negativos)
    return pontosCursosM + pontosCursosC + pontosCondecoracoes + pontosElogios - pontosPunicoes;
  };
  
  // Filtrar oficiais ativos
  const oficiais = mockMilitares
    .filter(m => (m.quadro === "QOEM" || m.quadro === "QOE") && m.situacao === "ativo")
    .map(m => ({
      ...m,
      pontuacao: calcularPontuacaoMilitar(m.id)
    }));
  
  // Filtrar praças ativas
  const pracas = mockMilitares
    .filter(m => m.quadro === "QPBM" && m.situacao === "ativo")
    .map(m => ({
      ...m,
      pontuacao: calcularPontuacaoMilitar(m.id)
    }));
  
  // Ordenar por pontuação (maior para menor)
  const oficiaisOrdenados = [...oficiais].sort((a, b) => {
    // Primeiro por pontuação
    if (b.pontuacao !== a.pontuacao) {
      return b.pontuacao - a.pontuacao;
    }
    // Em caso de empate, por antiguidade (data de inclusão)
    return new Date(a.dataInclusao).getTime() - new Date(b.dataInclusao).getTime();
  });
  
  const pracasOrdenadas = [...pracas].sort((a, b) => {
    if (b.pontuacao !== a.pontuacao) {
      return b.pontuacao - a.pontuacao;
    }
    return new Date(a.dataInclusao).getTime() - new Date(b.dataInclusao).getTime();
  });
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Acesso por Merecimento (QAM)</h1>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="oficiais">Oficiais</TabsTrigger>
          <TabsTrigger value="pracas">Praças</TabsTrigger>
        </TabsList>
        
        <TabsContent value="oficiais">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Quadro de Acesso por Merecimento - Oficiais</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Pontuação Total</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oficiaisOrdenados.length > 0 ? (
                    oficiaisOrdenados.map((militar, index) => (
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
                      <TableCell colSpan={5} className="text-center">Não há oficiais cadastrados.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pracas">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Quadro de Acesso por Merecimento - Praças</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Graduação</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Pontuação Total</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pracasOrdenadas.length > 0 ? (
                    pracasOrdenadas.map((militar, index) => (
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
                      <TableCell colSpan={5} className="text-center">Não há praças cadastradas.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Critérios de Merecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Conforme a Lei 7.772/2022, a pontuação para o Quadro de Acesso por Merecimento é calculada com base nos seguintes critérios:
            </p>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Pontos Positivos:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cursos Militares: até 10 pontos, conforme a categoria do curso;</li>
                <li>Cursos Civis: até 4 pontos, dependendo do nível (superior, especialização, mestrado, doutorado);</li>
                <li>Medalhas e Condecorações: até 1 ponto, variando conforme a autoridade concedente;</li>
                <li>Elogios: até 0,25 ponto, dependendo se individual ou coletivo.</li>
              </ul>
              
              <h3 className="font-semibold">Pontos Negativos:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Punições: até 5 pontos negativos, conforme a gravidade (repreensão, detenção ou prisão);</li>
                <li>Falta de aproveitamento em cursos militares: até 5 pontos negativos.</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              No caso de empate na pontuação final, prevalece o critério de antiguidade para o desempate.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Merecimento;
