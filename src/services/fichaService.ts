import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";

// Interface for saving ficha conceito data
interface FichaConceitoData {
  militarId: string;
  tempoServicoQuadro?: number;
  totalPontos: number;
}

// Interface para dados extraídos do PDF
export interface ExtractedData {
  cursosMilitares?: {
    nome: string;
    tipo: string;
    instituicao?: string;
    cargaHoraria?: number;
    pontos?: number;
    dataRecebimento?: string;
  }[];
  cursosCivis?: {
    nome: string;
    tipo: string;
    instituicao?: string;
    cargaHoraria?: number;
    pontos?: number;
    dataRecebimento?: string;
  }[];
  condecoracoes?: {
    tipo: string;
    descricao?: string;
    pontos?: number;
    dataRecebimento?: string;
  }[];
  elogios?: {
    tipo: string;
    descricao?: string;
    pontos?: number;
    dataRecebimento?: string;
  }[];
  punicoes?: {
    tipo: string;
    descricao?: string;
    pontos?: number;
    dataRecebimento?: string;
  }[];
}

// Importa os dados extraídos do PDF para o banco de dados
export const importDataFromPDFExtraction = async (militarId: string, data: ExtractedData) => {
  try {
    // Importar cursos militares
    if (data.cursosMilitares && data.cursosMilitares.length > 0) {
      const cursosMilitares = data.cursosMilitares.map(curso => ({
        id: uuidv4(),
        militar_id: militarId,
        nome: curso.nome,
        tipo: curso.tipo || "Especialização",
        instituicao: curso.instituicao || "",
        cargahoraria: curso.cargaHoraria || 0,
        pontos: curso.pontos || 0
      }));
      
      const { error } = await supabase
        .from('cursos_militares')
        .insert(cursosMilitares);
      
      if (error) throw error;
    }
    
    // Importar cursos civis
    if (data.cursosCivis && data.cursosCivis.length > 0) {
      const cursosCivis = data.cursosCivis.map(curso => ({
        id: uuidv4(),
        militar_id: militarId,
        nome: curso.nome,
        tipo: curso.tipo || "Superior",
        instituicao: curso.instituicao || "",
        cargahoraria: curso.cargaHoraria || 0,
        pontos: curso.pontos || 0
      }));
      
      const { error } = await supabase
        .from('cursos_civis')
        .insert(cursosCivis);
      
      if (error) throw error;
    }
    
    // Importar condecorações
    if (data.condecoracoes && data.condecoracoes.length > 0) {
      const condecoracoes = data.condecoracoes.map(cond => ({
        id: uuidv4(),
        militar_id: militarId,
        tipo: cond.tipo,
        descricao: cond.descricao || "",
        pontos: cond.pontos || 0,
        datarecebimento: cond.dataRecebimento || new Date().toISOString().split('T')[0]
      }));
      
      const { error } = await supabase
        .from('condecoracoes')
        .insert(condecoracoes);
      
      if (error) throw error;
    }
    
    // Importar elogios
    if (data.elogios && data.elogios.length > 0) {
      const elogios = data.elogios.map(elogio => ({
        id: uuidv4(),
        militar_id: militarId,
        tipo: elogio.tipo,
        descricao: elogio.descricao || "",
        pontos: elogio.pontos || 0,
        datarecebimento: elogio.dataRecebimento || new Date().toISOString().split('T')[0]
      }));
      
      const { error } = await supabase
        .from('elogios')
        .insert(elogios);
      
      if (error) throw error;
    }
    
    // Importar punições
    if (data.punicoes && data.punicoes.length > 0) {
      const punicoes = data.punicoes.map(punicao => ({
        id: uuidv4(),
        militar_id: militarId,
        tipo: punicao.tipo,
        descricao: punicao.descricao || "",
        pontos: punicao.pontos || 0,
        datarecebimento: punicao.dataRecebimento || new Date().toISOString().split('T')[0]
      }));
      
      const { error } = await supabase
        .from('punicoes')
        .insert(punicoes);
      
      if (error) throw error;
    }
    
    // Atualizar a ficha de conceito do militar
    await atualizarFichaConceito(militarId);
    
    return true;
  } catch (error) {
    console.error("Erro ao importar dados do PDF:", error);
    throw error;
  }
};

// Calcular e atualizar a ficha de conceito do militar
export const atualizarFichaConceito = async (militarId: string) => {
  try {
    // Buscar todos os dados de formação do militar
    const [
      { data: cursosMilitares },
      { data: cursosCivis }, 
      { data: condecoracoes }, 
      { data: elogios }, 
      { data: punicoes }
    ] = await Promise.all([
      supabase.from('cursos_militares').select('*').eq('militar_id', militarId),
      supabase.from('cursos_civis').select('*').eq('militar_id', militarId),
      supabase.from('condecoracoes').select('*').eq('militar_id', militarId),
      supabase.from('elogios').select('*').eq('militar_id', militarId),
      supabase.from('punicoes').select('*').eq('militar_id', militarId)
    ]);
    
    // Calcular o total de pontos
    const pontosCursosMilitares = cursosMilitares?.reduce((sum, curso) => sum + (curso.pontos || 0), 0) || 0;
    const pontosCursosCivis = cursosCivis?.reduce((sum, curso) => sum + (curso.pontos || 0), 0) || 0;
    const pontosCondecoracoes = condecoracoes?.reduce((sum, cond) => sum + (cond.pontos || 0), 0) || 0;
    const pontosElogios = elogios?.reduce((sum, elogio) => sum + (elogio.pontos || 0), 0) || 0;
    const pontosPunicoes = punicoes?.reduce((sum, punicao) => sum + (punicao.pontos || 0), 0) || 0;
    
    const totalPontos = pontosCursosMilitares + pontosCursosCivis + pontosCondecoracoes + pontosElogios - pontosPunicoes;
    
    // Verificar se o militar já tem uma ficha de conceito
    const { data: fichaExistente } = await supabase
      .from('fichas_conceito')
      .select('*')
      .eq('militar_id', militarId)
      .single();
    
    if (fichaExistente) {
      // Atualizar ficha existente
      await supabase
        .from('fichas_conceito')
        .update({
          totalpontos: totalPontos,
          updated_at: new Date().toISOString()
        })
        .eq('id', fichaExistente.id);
    } else {
      // Criar nova ficha
      await supabase
        .from('fichas_conceito')
        .insert({
          militar_id: militarId,
          totalpontos: totalPontos,
        });
    }
    
    return totalPontos;
  } catch (error) {
    console.error("Erro ao atualizar ficha de conceito:", error);
    throw error;
  }
};

// Salvar a ficha de conceito do militar
export const salvarFichaConceito = async (data: FichaConceitoData) => {
  try {
    // Verificar se o militar já tem uma ficha de conceito
    const { data: fichaExistente } = await supabase
      .from('fichas_conceito')
      .select('*')
      .eq('militar_id', data.militarId)
      .single();
    
    if (fichaExistente) {
      // Atualizar ficha existente
      const { error } = await supabase
        .from('fichas_conceito')
        .update({
          temposervicoquadro: data.tempoServicoQuadro || fichaExistente.temposervicoquadro,
          totalpontos: data.totalPontos,
          updated_at: new Date().toISOString()
        })
        .eq('id', fichaExistente.id);
        
      if (error) throw error;
    } else {
      // Criar nova ficha
      const { error } = await supabase
        .from('fichas_conceito')
        .insert({
          militar_id: data.militarId,
          temposervicoquadro: data.tempoServicoQuadro || 0,
          totalpontos: data.totalPontos,
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar ficha de conceito:", error);
    throw error;
  }
};
