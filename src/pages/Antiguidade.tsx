
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Antiguidade = () => {
  const [tabValue, setTabValue] = useState("oficiais");
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo");
          
        if (error) throw error;
        
        // Converter os dados do formato do banco para o formato do tipo Militar
        const militaresFormatados = data.map(item => ({
          id: item.id,
          nomeCompleto: item.nome,
          nomeGuerra: item.nomeguerra,
          posto: item.posto,
          quadro: item.quadro,
          dataNascimento: item.datanascimento,
          dataInclusao: item.data_ingresso,
          dataUltimaPromocao: item.dataultimapromocao,
          situacao: item.situacao,
          email: item.email,
          foto: item.foto
        }));
        
        setMilitares(militaresFormatados);
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitares();
  }, []);
  
  // Função para ordenar militares por antiguidade
  const ordenarPorAntiguidade = (militares: Militar[]): Militar[] => {
    return [...militares].sort((a, b) => {
      // Primeiro critério: Data de inclusão (mais antiga primeiro)
      const dataInclusaoA = new Date(a.dataInclusao).getTime();
      const dataInclusaoB = new Date(b.dataInclusao).getTime();
      if (dataInclusaoA !== dataInclusaoB) {
        return dataInclusaoA - dataInclusaoB;
      }
      
      // Segundo critério: Data da última promoção (mais antiga primeiro)
      const dataPromocaoA = new Date(a.dataUltimaPromocao).getTime();
      const dataPromocaoB = new Date(b.dataUltimaPromocao).getTime();
      if (dataPromocaoA !== dataPromocaoB) {
        return dataPromocaoA - dataPromocaoB;
      }
      
      // Terceiro critério: Data de nascimento (mais velho primeiro)
      const dataNascimentoA = new Date(a.dataNascimento).getTime();
      const dataNascimentoB = new Date(b.dataNascimento).getTime();
      return dataNascimentoA - dataNascimentoB;
    });
  };
  
  // Filtrar oficiais ativos
  const oficiais = militares.filter(m => 
    (m.quadro === "QOEM" || m.quadro === "QOE") && m.situacao === "ativo"
  );
  
  // Filtrar praças ativas
  const pracas = militares.filter(m => 
    m.quadro === "QPBM" && m.situacao === "ativo"
  );
  
  // Ordenar por antiguidade
  const oficiaisOrdenados = ordenarPorAntiguidade(oficiais);
  const pracasOrdenadas = ordenarPorAntiguidade(pracas);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Acesso por Antiguidade (QAA)</h1>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="oficiais">Oficiais</TabsTrigger>
          <TabsTrigger value="pracas">Praças</TabsTrigger>
        </TabsList>
        
        <TabsContent value="oficiais">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Quadro de Acesso por Antiguidade - Oficiais</CardTitle>
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
                      <TableHead>Data de Inclusão</TableHead>
                      <TableHead>Última Promoção</TableHead>
                      <TableHead>Idade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {oficiaisOrdenados.length > 0 ? (
                      oficiaisOrdenados.map((militar, index) => (
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
                        <TableCell colSpan={6} className="text-center">Não há oficiais cadastrados.</TableCell>
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
              <CardTitle>Quadro de Acesso por Antiguidade - Praças</CardTitle>
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
                      <TableHead>Data de Inclusão</TableHead>
                      <TableHead>Última Promoção</TableHead>
                      <TableHead>Idade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pracasOrdenadas.length > 0 ? (
                      pracasOrdenadas.map((militar, index) => (
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
                        <TableCell colSpan={6} className="text-center">Não há praças cadastradas.</TableCell>
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
          <CardTitle>Critérios de Antiguidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              De acordo com a Lei 7.772/2022, o ordenamento hierárquico dos oficiais e praças é determinado pelos seguintes critérios de antiguidade:
            </p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Data de ingresso no respectivo quadro (mais antiga confere maior antiguidade);</li>
              <li>Data da última promoção (mais antiga confere maior antiguidade);</li>
              <li>Data de nascimento (maior idade confere maior antiguidade);</li>
              <li>Classificação em curso de formação ou habilitação (melhor classificação confere maior antiguidade).</li>
            </ol>
            
            <p className="text-sm text-muted-foreground mt-4">
              A posição no Quadro de Acesso por Antiguidade (QAA) é um dos critérios para promoção conforme estabelecido na legislação vigente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Antiguidade;
