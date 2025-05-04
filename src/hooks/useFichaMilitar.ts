
import { useState, useCallback, useEffect } from "react";
import { Militar, CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao, CursoMilitarTipo, CursoCivilTipo } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";

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
  
  // Using useCallback to memoize the function and prevent re-renders
  const calcularTotalPontos = useCallback(() => {
    const pontosM = cursosMilitares.reduce((sum, curso) => sum + (curso.pontos || 0), 0);
    const pontosC = cursosCivis.reduce((sum, curso) => sum + (curso.pontos || 0), 0);
    const pontosD = condecoracoes.reduce((sum, cond) => sum + (cond.pontos || 0), 0);
    const pontosE = elogios.reduce((sum, elogio) => sum + (elogio.pontos || 0), 0);
    const pontosP = punicoes.reduce((sum, punicao) => sum + (punicao.pontos || 0), 0);
    
    setTotalPontos(pontosM + pontosC + pontosD + pontosE - pontosP);
  }, [cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes]);

  // Funções auxiliares para buscar dados relacionados
  const buscarCursosMilitares = async (militarId: string) => {
    const { data, error } = await supabase
      .from("cursos_militares")
      .select("*")
      .eq("militar_id", militarId);
      
    if (error) throw error;
    
    const cursosMapeados = data.map(curso => ({
      id: curso.id,
      militarId: curso.militar_id,
      nome: curso.nome,
      tipo: (curso.tipo as CursoMilitarTipo) || "Especialização",
      instituicao: curso.instituicao,
      cargaHoraria: curso.cargahoraria,
      pontos: curso.pontos,
      anexo: curso.anexo
    }));
    
    setCursosMilitares(cursosMapeados);
    return cursosMapeados;
  };

  const buscarCursosCivis = async (militarId: string) => {
    const { data, error } = await supabase
      .from("cursos_civis")
      .select("*")
      .eq("militar_id", militarId);
      
    if (error) throw error;
    
    const cursosMapeados = data.map(curso => ({
      id: curso.id,
      militarId: curso.militar_id,
      nome: curso.nome,
      tipo: (curso.tipo as CursoCivilTipo) || "Superior",
      instituicao: curso.instituicao,
      cargaHoraria: curso.cargahoraria,
      pontos: curso.pontos,
      anexo: curso.anexo
    }));
    
    setCursosCivis(cursosMapeados);
    return cursosMapeados;
  };

  const buscarCondecoracoes = async (militarId: string) => {
    const { data, error } = await supabase
      .from("condecoracoes")
      .select("*")
      .eq("militar_id", militarId);
      
    if (error) throw error;
    
    const condecoracoesMapeadas = data.map(cond => ({
      id: cond.id,
      militarId: cond.militar_id,
      tipo: cond.tipo as Condecoracao["tipo"],
      descricao: cond.descricao,
      pontos: cond.pontos,
      dataRecebimento: cond.datarecebimento,
      anexo: cond.anexo
    }));
    
    setCondecoracoes(condecoracoesMapeadas);
    return condecoracoesMapeadas;
  };

  const buscarElogios = async (militarId: string) => {
    const { data, error } = await supabase
      .from("elogios")
      .select("*")
      .eq("militar_id", militarId);
      
    if (error) throw error;
    
    const elogiosMapeados = data.map(elogio => ({
      id: elogio.id,
      militarId: elogio.militar_id,
      tipo: elogio.tipo as "Individual" | "Coletivo",
      descricao: elogio.descricao,
      pontos: elogio.pontos,
      dataRecebimento: elogio.datarecebimento,
      anexo: elogio.anexo
    }));
    
    setElogios(elogiosMapeados);
    return elogiosMapeados;
  };

  const buscarPunicoes = async (militarId: string) => {
    const { data, error } = await supabase
      .from("punicoes")
      .select("*")
      .eq("militar_id", militarId);
      
    if (error) throw error;
    
    const punicoesMapeadas = data.map(punicao => ({
      id: punicao.id,
      militarId: punicao.militar_id,
      tipo: punicao.tipo as "Repreensão" | "Detenção" | "Prisão",
      descricao: punicao.descricao,
      pontos: punicao.pontos,
      dataRecebimento: punicao.datarecebimento,
      anexo: punicao.anexo
    }));
    
    setPunicoes(punicoesMapeadas);
    return punicoesMapeadas;
  };

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
          nomeCompleto: militarData.nome,
          nomeGuerra: militarData.nomeguerra,
          posto: toPostoPatente(militarData.posto),
          quadro: toQuadroMilitar(militarData.quadro),
          dataNascimento: militarData.datanascimento,
          dataInclusao: militarData.data_ingresso,
          dataUltimaPromocao: militarData.dataultimapromocao,
          situacao: toSituacaoMilitar(militarData.situacao),
          email: militarData.email,
          foto: militarData.foto,
          tipoSanguineo: toTipoSanguineo(militarData.tipo_sanguineo),
          sexo: toSexo(militarData.sexo)
        });
      }
      
      // Carregar dados relacionados
      await Promise.all([
        buscarCursosMilitares(id),
        buscarCursosCivis(id),
        buscarCondecoracoes(id),
        buscarElogios(id),
        buscarPunicoes(id)
      ]);
      
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
    setActiveTab
  };
};

export default useFichaMilitar;
