
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Militar } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MerecimentoList } from "@/components/merecimento/MerecimentoList";
import { CriteriosMerecimento } from "@/components/merecimento/CriteriosMerecimento";
import { toQuadroMilitar, toPostoPatente, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";

// Type that extends Militar with score
export type MilitarComPontuacao = Militar & { pontuacao: number };

// Component to render the list of militares with score
interface MeritTableProps {
  militares: MilitarComPontuacao[];
  loading: boolean;
  tipo: "oficiais" | "pracas";
  titulo: string;
}

const MeritTable = ({ militares, loading, tipo, titulo }: MeritTableProps) => {
  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MerecimentoList 
          militares={militares}
          loading={loading}
          tipo={tipo}
        />
      </CardContent>
    </Card>
  );
};

// Custom hook to fetch and calculate scores
const useMilitaresPontuacao = () => {
  const [oficiais, setOficiais] = useState<MilitarComPontuacao[]>([]);
  const [pracas, setPracas] = useState<MilitarComPontuacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar dados necessários
        const { data: militares, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo");

        if (error) throw error;

        const { data: cursosMilitares } = await supabase.from("cursos_militares").select("*");
        const { data: cursosCivis } = await supabase.from("cursos_civis").select("*");
        const { data: condecoracoes } = await supabase.from("condecoracoes").select("*");
        const { data: elogios } = await supabase.from("elogios").select("*");
        const { data: punicoes } = await supabase.from("punicoes").select("*");

        const militaresComPontuacao = calcularPontuacaoMilitares(
          militares || [], 
          cursosMilitares || [], 
          cursosCivis || [], 
          condecoracoes || [], 
          elogios || [], 
          punicoes || []
        );

        const { oficiaisOrdenados, pracasOrdenadas } = separarEOrdenarPorMerito(militaresComPontuacao);

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

  return { oficiais, pracas, loading };
};

// Function to calculate score for each militar
const calcularPontuacaoMilitares = (
  militares: any[], 
  cursosMilitares: any[], 
  cursosCivis: any[], 
  condecoracoes: any[], 
  elogios: any[], 
  punicoes: any[]
): MilitarComPontuacao[] => {
  return militares.map(militar => {
    const id = militar.id;

    const pontosCursosM = somaPontos(cursosMilitares.filter(c => c.militar_id === id));
    const pontosCursosC = somaPontos(cursosCivis.filter(c => c.militar_id === id));
    const pontosCondecoracoes = somaPontos(condecoracoes.filter(c => c.militar_id === id));
    const pontosElogios = somaPontos(elogios.filter(e => e.militar_id === id));
    const pontosPunicoes = somaPontos(punicoes.filter(p => p.militar_id === id));

    const pontuacao = pontosCursosM + pontosCursosC + pontosCondecoracoes + pontosElogios - pontosPunicoes;

    return {
      id: militar.id,
      nome: militar.nome, // Keep the nome field
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
      tipoSanguineo: toTipoSanguineo(militar.tipo_sanguineo),
      sexo: toSexo(militar.sexo),
      pontuacao
    };
  });
};

// Helper function to sum points
const somaPontos = (items: any[]): number => {
  return items.reduce((acc, item) => acc + (item.pontos || 0), 0);
};

// Function to separate and sort militares by merit
const separarEOrdenarPorMerito = (militaresComPontuacao: MilitarComPontuacao[]) => {
  const oficiaisAtivos = militaresComPontuacao.filter(
    m => (m.quadro === "QOEM" || m.quadro === "QOE") && m.situacao === "ativo"
  );

  const pracasAtivas = militaresComPontuacao.filter(
    m => m.quadro === "QPBM" && m.situacao === "ativo"
  );

  const ordenarPorMerito = (militares: MilitarComPontuacao[]) => {
    return [...militares].sort((a, b) => {
      if (b.pontuacao !== a.pontuacao) {
        return b.pontuacao - a.pontuacao;
      }
      return new Date(a.dataInclusao).getTime() - new Date(b.dataInclusao).getTime();
    });
  };

  return {
    oficiaisOrdenados: ordenarPorMerito(oficiaisAtivos),
    pracasOrdenadas: ordenarPorMerito(pracasAtivas)
  };
};

const Merecimento = () => {
  const [tabValue, setTabValue] = useState("oficiais");
  const { oficiais, pracas, loading } = useMilitaresPontuacao();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Acesso por Merecimento (QAM)</h1>

      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="oficiais">Oficiais</TabsTrigger>
          <TabsTrigger value="pracas">Praças</TabsTrigger>
        </TabsList>

        <TabsContent value="oficiais">
          <MeritTable 
            militares={oficiais}
            loading={loading}
            tipo="oficiais"
            titulo="Quadro de Acesso por Merecimento - Oficiais"
          />
        </TabsContent>

        <TabsContent value="pracas">
          <MeritTable 
            militares={pracas}
            loading={loading}
            tipo="pracas"
            titulo="Quadro de Acesso por Merecimento - Praças"
          />
        </TabsContent>
      </Tabs>

      <CriteriosMerecimento />
    </div>
  );
};

export default Merecimento;
