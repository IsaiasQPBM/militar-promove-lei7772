
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Militar } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MerecimentoList } from "@/components/merecimento/MerecimentoList";
import { CriteriosMerecimento } from "@/components/merecimento/CriteriosMerecimento";
import { toQuadroMilitar, toPostoPatente, toSituacaoMilitar } from "@/utils/typeConverters";

type MilitarComPontuacao = Militar & { pontuacao: number };

const Merecimento = () => {
  const [tabValue, setTabValue] = useState("oficiais");
  const [oficiais, setOficiais] = useState<MilitarComPontuacao[]>([]);
  const [pracas, setPracas] = useState<MilitarComPontuacao[]>([]);
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
        const militaresComPontuacao: MilitarComPontuacao[] = militares.map(militar => {
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
            posto: toPostoPatente(militar.posto),
            quadro: toQuadroMilitar(militar.quadro),
            dataNascimento: militar.datanascimento,
            dataInclusao: militar.data_ingresso,
            dataUltimaPromocao: militar.dataultimapromocao,
            situacao: toSituacaoMilitar(militar.situacao),
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
              <MerecimentoList 
                militares={oficiais}
                loading={loading} 
                tipo="oficiais" 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pracas">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle>Quadro de Acesso por Merecimento - Praças</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MerecimentoList 
                militares={pracas} 
                loading={loading}
                tipo="pracas" 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CriteriosMerecimento />
    </div>
  );
};

export default Merecimento;
