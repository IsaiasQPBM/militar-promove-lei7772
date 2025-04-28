
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Militar, CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DadosPessoais } from "@/components/fichaMilitar/DadosPessoais";
import { DadosFormacao } from "@/components/fichaMilitar/DadosFormacao";
import { toQuadroMilitar, toPostoPatente, toSituacaoMilitar } from "@/utils/typeConverters";

const FichaMilitar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [militar, setMilitar] = useState<Militar | null>(null);
  const [cursosMilitares, setCursosMilitares] = useState<CursoMilitar[]>([]);
  const [cursosCivis, setCursosCivis] = useState<CursoCivil[]>([]);
  const [condecoracoes, setCondecoracoes] = useState<Condecoracao[]>([]);
  const [elogios, setElogios] = useState<Elogio[]>([]);
  const [punicoes, setPunicoes] = useState<Punicao[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Obter dados do militar
          const { data: militarData, error: militarError } = await supabase
            .from("militares")
            .select("*")
            .eq("id", id)
            .single();
            
          if (militarError) throw militarError;
          
          if (militarData) {
            // Converter do formato do banco para o formato do tipo Militar
            setMilitar({
              id: militarData.id,
              nomeCompleto: militarData.nome,
              nomeGuerra: militarData.nomeguerra,
              posto: toPostoPatente(militarData.posto),
              quadro: toQuadroMilitar(militarData.quadro),
              dataNascimento: militarData.datanascimento,
              dataInclusao: militarData.data_ingresso,
              dataUltimaPromocao: militarData.dataultimapromocao,
              situacao: toSituacaoMilitar(militarData.situacao),
              email: militarData.email,
              foto: militarData.foto
            });
          }
          
          // Obter cursos militares
          const { data: cursosMilitaresData, error: cursosMilitaresError } = await supabase
            .from("cursos_militares")
            .select("*")
            .eq("militar_id", id);
            
          if (cursosMilitaresError) throw cursosMilitaresError;
          
          // Converter do formato do banco para o formato do tipo
          const cursosMilitaresMapeados = cursosMilitaresData.map(curso => ({
            id: curso.id,
            militarId: curso.militar_id,
            nome: curso.nome,
            instituicao: curso.instituicao,
            cargaHoraria: curso.cargahoraria,
            pontos: curso.pontos,
            anexo: curso.anexo
          }));
          
          setCursosMilitares(cursosMilitaresMapeados);
          
          // Obter cursos civis
          const { data: cursosCivisData, error: cursosCivisError } = await supabase
            .from("cursos_civis")
            .select("*")
            .eq("militar_id", id);
            
          if (cursosCivisError) throw cursosCivisError;
          
          // Converter do formato do banco para o formato do tipo
          const cursosCivisMapeados = cursosCivisData.map(curso => ({
            id: curso.id,
            militarId: curso.militar_id,
            nome: curso.nome,
            instituicao: curso.instituicao,
            cargaHoraria: curso.cargahoraria,
            pontos: curso.pontos,
            anexo: curso.anexo
          }));
          
          setCursosCivis(cursosCivisMapeados);
          
          // Obter condecorações
          const { data: condecoracoesData, error: condecoracoesError } = await supabase
            .from("condecoracoes")
            .select("*")
            .eq("militar_id", id);
            
          if (condecoracoesError) throw condecoracoesError;
          
          // Converter do formato do banco para o formato do tipo
          const condecoracoesMapeadas = condecoracoesData.map(cond => ({
            id: cond.id,
            militarId: cond.militar_id,
            tipo: cond.tipo,
            descricao: cond.descricao,
            pontos: cond.pontos,
            dataRecebimento: cond.datarecebimento,
            anexo: cond.anexo
          }));
          
          setCondecoracoes(condecoracoesMapeadas);
          
          // Obter elogios
          const { data: elogiosData, error: elogiosError } = await supabase
            .from("elogios")
            .select("*")
            .eq("militar_id", id);
            
          if (elogiosError) throw elogiosError;
          
          // Converter do formato do banco para o formato do tipo
          const elogiosMapeados = elogiosData.map(elogio => ({
            id: elogio.id,
            militarId: elogio.militar_id,
            tipo: elogio.tipo as "Individual" | "Coletivo",
            descricao: elogio.descricao,
            pontos: elogio.pontos,
            dataRecebimento: elogio.datarecebimento,
            anexo: elogio.anexo
          }));
          
          setElogios(elogiosMapeados);
          
          // Obter punições
          const { data: punicoesData, error: punicoesError } = await supabase
            .from("punicoes")
            .select("*")
            .eq("militar_id", id);
            
          if (punicoesError) throw punicoesError;
          
          // Converter do formato do banco para o formato do tipo
          const punicoesMapeadas = punicoesData.map(punicao => ({
            id: punicao.id,
            militarId: punicao.militar_id,
            tipo: punicao.tipo as "Repreensão" | "Detenção" | "Prisão",
            descricao: punicao.descricao,
            pontos: punicao.pontos,
            dataRecebimento: punicao.datarecebimento,
            anexo: punicao.anexo
          }));
          
          setPunicoes(punicoesMapeadas);
          
          // Calcular total de pontos
          const pontosM = cursosMilitaresMapeados.reduce((sum, curso) => sum + (curso.pontos || 0), 0);
          const pontosC = cursosCivisMapeados.reduce((sum, curso) => sum + (curso.pontos || 0), 0);
          const pontosD = condecoracoesMapeadas.reduce((sum, cond) => sum + (cond.pontos || 0), 0);
          const pontosE = elogiosMapeados.reduce((sum, elogio) => sum + (elogio.pontos || 0), 0);
          const pontosP = punicoesMapeadas.reduce((sum, punicao) => sum + (punicao.pontos || 0), 0);
          
          setTotalPontos(pontosM + pontosC + pontosD + pontosE - pontosP);
          
        } catch (error) {
          console.error("Erro ao buscar dados do militar:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os dados do militar.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple"></div>
        <span className="ml-2">Carregando dados do militar...</span>
      </div>
    );
  }
  
  if (!militar) {
    return <div className="flex justify-center items-center h-64">Militar não encontrado.</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ficha Individual do Militar</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(`/militar/${id}/editar`)}
            variant="outline"
          >
            Editar Dados
          </Button>
          <Button
            onClick={() => navigate(`/militar/${id}/promocoes`)}
            variant="outline"
          >
            Histórico de Promoções
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </div>
      
      {/* Dados do Militar */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <DadosPessoais militar={militar} />
      </Card>
      
      {/* Ficha de Conceito */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Ficha de Conceito do Militar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="cursos-militares" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="cursos-militares">Cursos Militares</TabsTrigger>
              <TabsTrigger value="cursos-civis">Cursos Civis</TabsTrigger>
              <TabsTrigger value="condecoracoes">Condecorações</TabsTrigger>
              <TabsTrigger value="elogios">Elogios</TabsTrigger>
              <TabsTrigger value="punicoes">Punições</TabsTrigger>
            </TabsList>
            
            <DadosFormacao
              cursosMilitares={cursosMilitares}
              cursosCivis={cursosCivis}
              condecoracoes={condecoracoes}
              elogios={elogios}
              punicoes={punicoes}
            />
          </Tabs>
          
          <Separator />
          
          <div className="p-4 flex justify-between items-center bg-gray-100">
            <span className="font-bold text-xl">Total de Pontos:</span>
            <span className="font-bold text-xl">{totalPontos.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FichaMilitar;
