
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Militar } from "@/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Merecimento = () => {
  const [tabValue, setTabValue] = useState("oficiais");
  const [oficiais, setOficiais] = useState<(Militar & { pontuacao: number })[]>([]);
  const [pracas, setPracas] = useState<(Militar & { pontuacao: number })[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar militares ativos
        const { data: militares, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo");
        
        if (error) throw error;
        
        // Buscar dados de pontuação para cálculo de mérito
        const { data: cursosMilitares, error: errorCursosM } = await supabase
          .from("cursos_militares")
          .select("*");
          
        if (errorCursosM) throw errorCursosM;
        
        const { data: cursosCivis, error: errorCursosC } = await supabase
          .from("cursos_civis")
          .select("*");
          
        if (errorCursosC) throw errorCursosC;
        
        const { data: condecoracoes, error: errorCond } = await supabase
          .from("condecoracoes")
          .select("*");
          
        if (errorCond) throw errorCond;
        
        const { data: elogios, error: errorElogios } = await supabase
          .from("elogios")
          .select("*");
          
        if (errorElogios) throw errorElogios;
        
        const { data: punicoes, error: errorPunicoes } = await supabase
          .from("punicoes")
          .select("*");
          
        if (errorPunicoes) throw errorPunicoes;
        
        // Calcular pontuação para cada militar
        const militaresComPontuacao = militares.map(militar => {
          const id = militar.id;
          
          // Pontos dos cursos militares
          const pontosCursosM = cursosMilitares
            .filter(curso => curso.militar_id === id)
            .reduce((acc, curso) => acc + (curso.pontos || 0), 0);
          
          // Pontos dos cursos civis
          const pontosCursosC = cursosCivis
            .filter(curso => curso.militar_id === id)
            .reduce((acc, curso) => acc + (curso.pontos || 0), 0);
          
          // Pontos das condecorações
          const pontosCondecoracoes = condecoracoes
            .filter(cond => cond.militar_id === id)
            .reduce((acc, cond) => acc + (cond.pontos || 0), 0);
          
          // Pontos dos elogios
          const pontosElogios = elogios
            .filter(elogio => elogio.militar_id === id)
            .reduce((acc, elogio) => acc + (elogio.pontos || 0), 0);
          
          // Pontos negativos das punições
          const pontosPunicoes = punicoes
            .filter(punicao => punicao.militar_id === id)
            .reduce((acc, punicao) => acc + (punicao.pontos || 0), 0);
          
          // Total de pontos
          const pontuacao = pontosCursosM + pontosCursosC + pontosCondecoracoes + pontosElogios - pontosPunicoes;
          
          // Converter dados do banco para o formato do tipo Militar
          return {
            id: militar.id,
            nomeCompleto: militar.nome,
            nomeGuerra: militar.nomeguerra,
            posto: militar.posto,
            quadro: militar.quadro,
            dataNascimento: militar.datanascimento,
            dataInclusao: militar.data_ingresso,
            dataUltimaPromocao: militar.dataultimapromocao,
            situacao: militar.situacao,
            email: militar.email,
            foto: militar.foto,
            pontuacao
          };
        });
        
        // Separar oficiais e praças
        const oficiaisAtivos = militaresComPontuacao.filter(
          m => (m.quadro === "QOEM" || m.quadro === "QOE") && m.situacao === "ativo"
        );
        
        const pracasAtivas = militaresComPontuacao.filter(
          m => m.quadro === "QPBM" && m.situacao === "ativo"
        );
        
        // Ordenar por pontuação e, em caso de empate, por antiguidade
        const oficiaisOrdenados = [...oficiaisAtivos].sort((a, b) => {
          if (b.pontuacao !== a.pontuacao) {
            return b.pontuacao - a.pontuacao;
          }
          return new Date(a.dataInclusao).getTime() - new Date(b.dataInclusao).getTime();
        });
        
        const pracasOrdenadas = [...pracasAtivas].sort((a, b) => {
          if (b.pontuacao !== a.pontuacao) {
            return b.pontuacao - a.pontuacao;
          }
          return new Date(a.dataInclusao).getTime() - new Date(b.dataInclusao).getTime();
        });
        
        setOficiais(oficiaisOrdenados);
        setPracas(pracasOrdenadas);
      } catch (error) {
        console.error("Erro ao buscar dados para o QAM:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados para o Quadro de Acesso por Merecimento.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple"></div>
                </div>
              ) : (
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
                    {oficiais.length > 0 ? (
                      oficiais.map((militar, index) => (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pracas">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Quadro de Acesso por Merecimento - Praças</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple"></div>
                </div>
              ) : (
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
                    {pracas.length > 0 ? (
                      pracas.map((militar, index) => (
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
              )}
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
