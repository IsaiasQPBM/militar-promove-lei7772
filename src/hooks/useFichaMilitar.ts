
import { useState, useCallback, useEffect } from "react";
import { Militar, CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";
import { 
  fetchCursosMilitares, 
  fetchCursosCivis, 
  fetchCondecoracoes, 
  fetchElogios, 
  fetchPunicoes 
} from "@/services/fichaService";

const useFichaMilitar = (id: string | undefined) => {
  const [militar, setMilitar] = useState<Militar | null>(null);
  const [cursosMilitares, setCursosMilitares] = useState<CursoMilitar[]>([]);
  const [cursosCivis, setCursosCivis] = useState<CursoCivil[]>([]);
  const [condecoracoes, setCondecoracoes] = useState<Condecoracao[]>([]);
  const [elogios, setElogios] = useState<Elogio[]>([]);
  const [punicoes, setPunicoes] = useState<Punicao[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dados-formacao");
  
  // Cálculo de pontos
  const calcularTotalPontos = useCallback(() => {
    const pontosM = cursosMilitares.reduce((sum, curso) => sum + (curso.pontos || 0), 0);
    const pontosC = cursosCivis.reduce((sum, curso) => sum + (curso.pontos || 0), 0);
    const pontosD = condecoracoes.reduce((sum, cond) => sum + (cond.pontos || 0), 0);
    const pontosE = elogios.reduce((sum, elogio) => sum + (elogio.pontos || 0), 0);
    const pontosP = punicoes.reduce((sum, punicao) => sum + (punicao.pontos || 0), 0);
    
    setTotalPontos(pontosM + pontosC + pontosD + pontosE - pontosP);
  }, [cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes]);

  // Função para buscar dados do militar
  const buscarDadosMilitar = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Buscar dados do militar
      const { data: militarData, error: militarError } = await supabase
        .from("militares")
        .select("*")
        .eq("id", id)
        .single();
        
      if (militarError) throw militarError;
      
      if (militarData) {
        setMilitar({
          id: militarData.id,
          nome: militarData.nome,
          nomeCompleto: militarData.nome,
          nomeGuerra: militarData.nomeguerra || militarData.nome,
          posto: toPostoPatente(militarData.posto),
          quadro: toQuadroMilitar(militarData.quadro),
          dataNascimento: militarData.datanascimento,
          dataInclusao: militarData.data_ingresso,
          dataUltimaPromocao: militarData.dataultimapromocao,
          situacao: toSituacaoMilitar(militarData.situacao),
          email: militarData.email,
          foto: militarData.foto,
          tipoSanguineo: toTipoSanguineo(militarData.tipo_sanguineo),
          sexo: toSexo(militarData.sexo),
          unidade: militarData.unidade
        });
      }
      
      // Carregar dados relacionados
      const [cursosMil, cursosCiv, cond, elog, pun] = await Promise.all([
        fetchCursosMilitares(id),
        fetchCursosCivis(id),
        fetchCondecoracoes(id),
        fetchElogios(id),
        fetchPunicoes(id)
      ]);
      
      setCursosMilitares(cursosMil);
      setCursosCivis(cursosCiv);
      setCondecoracoes(cond);
      setElogios(elog);
      setPunicoes(pun);
      
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
  }, [id]);

  // Função para atualizar os dados
  const refreshData = useCallback(async () => {
    if (!id) return;
    
    try {
      // Apenas recarregar os dados relacionados, não o militar principal
      const [cursosMil, cursosCiv, cond, elog, pun] = await Promise.all([
        fetchCursosMilitares(id),
        fetchCursosCivis(id),
        fetchCondecoracoes(id),
        fetchElogios(id),
        fetchPunicoes(id)
      ]);
      
      setCursosMilitares(cursosMil);
      setCursosCivis(cursosCiv);
      setCondecoracoes(cond);
      setElogios(elog);
      setPunicoes(pun);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados da ficha foram atualizados com sucesso."
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os dados do militar.",
        variant: "destructive"
      });
    }
  }, [id]);

  // Inicialização - carrega dados apenas uma vez
  useEffect(() => {
    buscarDadosMilitar();
  }, [buscarDadosMilitar]);

  // Atualiza o total de pontos sempre que os dados relacionados mudarem
  useEffect(() => {
    calcularTotalPontos();
  }, [calcularTotalPontos]);

  return { 
    militar, 
    cursosMilitares, 
    cursosCivis, 
    condecoracoes, 
    elogios, 
    punicoes, 
    totalPontos,
    loading,
    activeTab,
    setActiveTab,
    refreshData
  };
};

export default useFichaMilitar;
