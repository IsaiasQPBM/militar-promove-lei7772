
import { supabase } from "@/integrations/supabase/client";
import { CursoCivil, CursoMilitar, Condecoracao, Elogio, Punicao } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Funções para buscar dados do militar
export const fetchCursosMilitares = async (militarId: string): Promise<CursoMilitar[]> => {
  const { data, error } = await supabase
    .from("cursos_militares")
    .select("*")
    .eq("militar_id", militarId);
    
  if (error) throw error;
  
  return data.map(curso => ({
    id: curso.id,
    militar_id: curso.militar_id,
    nome: curso.nome,
    tipo: curso.tipo || "Especialização",
    instituicao: curso.instituicao || "",
    cargahoraria: curso.cargahoraria || 0,
    pontos: curso.pontos || 0
  }));
};

export const fetchCursosCivis = async (militarId: string): Promise<CursoCivil[]> => {
  const { data, error } = await supabase
    .from("cursos_civis")
    .select("*")
    .eq("militar_id", militarId);
    
  if (error) throw error;
  
  return data.map(curso => ({
    id: curso.id,
    militar_id: curso.militar_id,
    nome: curso.nome,
    tipo: curso.tipo || "Superior",
    instituicao: curso.instituicao || "",
    cargahoraria: curso.cargahoraria || 0,
    pontos: curso.pontos || 0
  }));
};

export const fetchCondecoracoes = async (militarId: string): Promise<Condecoracao[]> => {
  const { data, error } = await supabase
    .from("condecoracoes")
    .select("*")
    .eq("militar_id", militarId);
    
  if (error) throw error;
  
  return data.map(cond => ({
    id: cond.id,
    militar_id: cond.militar_id,
    tipo: cond.tipo,
    descricao: cond.descricao,
    pontos: cond.pontos,
    datarecebimento: cond.datarecebimento
  }));
};

export const fetchElogios = async (militarId: string): Promise<Elogio[]> => {
  const { data, error } = await supabase
    .from("elogios")
    .select("*")
    .eq("militar_id", militarId);
    
  if (error) throw error;
  
  return data.map(elogio => ({
    id: elogio.id,
    militar_id: elogio.militar_id,
    tipo: elogio.tipo,
    descricao: elogio.descricao,
    pontos: elogio.pontos,
    datarecebimento: elogio.datarecebimento
  }));
};

export const fetchPunicoes = async (militarId: string): Promise<Punicao[]> => {
  const { data, error } = await supabase
    .from("punicoes")
    .select("*")
    .eq("militar_id", militarId);
    
  if (error) throw error;
  
  return data.map(punicao => ({
    id: punicao.id,
    militar_id: punicao.militar_id,
    tipo: punicao.tipo,
    descricao: punicao.descricao,
    pontos: punicao.pontos,
    datarecebimento: punicao.datarecebimento
  }));
};

// Ficha Conceito
export const createOrUpdateFichaConceito = async (militarId: string, totalPontos: number) => {
  try {
    // Check if ficha already exists
    const { data: existingFicha, error: fetchError } = await supabase
      .from("fichas_conceito")
      .select("id")
      .eq("militar_id", militarId)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    
    if (existingFicha) {
      // Update existing ficha
      const { error } = await supabase
        .from("fichas_conceito")
        .update({
          totalpontos: totalPontos,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingFicha.id);
        
      if (error) throw error;
      return existingFicha.id;
    } else {
      // Create new ficha
      const { data, error } = await supabase
        .from("fichas_conceito")
        .insert({
          militar_id: militarId,
          totalpontos: totalPontos
        })
        .select("id")
        .single();
        
      if (error) throw error;
      return data.id;
    }
  } catch (error) {
    console.error("Error creating/updating ficha conceito:", error);
    throw error;
  }
};

// Função para salvar ficha conceito com tempo de serviço
export const salvarFichaConceito = async ({ 
  militarId, 
  tempoServicoQuadro, 
  totalPontos 
}: { 
  militarId: string; 
  tempoServicoQuadro: number;
  totalPontos: number;
}) => {
  try {
    // Check if ficha already exists
    const { data: existingFicha, error: fetchError } = await supabase
      .from("fichas_conceito")
      .select("id")
      .eq("militar_id", militarId)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    
    if (existingFicha) {
      // Update existing ficha
      const { error } = await supabase
        .from("fichas_conceito")
        .update({
          totalpontos: totalPontos,
          temposervicoquadro: tempoServicoQuadro,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingFicha.id);
        
      if (error) throw error;
      return existingFicha.id;
    } else {
      // Create new ficha
      const { data, error } = await supabase
        .from("fichas_conceito")
        .insert({
          militar_id: militarId,
          totalpontos: totalPontos,
          temposervicoquadro: tempoServicoQuadro
        })
        .select("id")
        .single();
        
      if (error) throw error;
      return data.id;
    }
  } catch (error) {
    console.error("Error saving ficha conceito:", error);
    throw error;
  }
};

// Funções de processamento para importação de PDFs
const processCursosMilitares = async (militarId: string, cursos: any[]) => {
  if (!cursos.length) return;
  
  const formattedCursos = cursos.map(curso => ({
    militar_id: militarId,
    nome: curso.nome,
    tipo: curso.tipo || "Especialização",
    instituicao: curso.instituicao || "",
    cargahoraria: curso.cargahoraria || curso.cargaHoraria || 0,
    pontos: curso.pontos || 0
  }));
  
  const { error } = await supabase
    .from("cursos_militares")
    .insert(formattedCursos);
    
  if (error) throw error;
};

const processCursosCivis = async (militarId: string, cursos: any[]) => {
  if (!cursos.length) return;
  
  const formattedCursos = cursos.map(curso => ({
    militar_id: militarId,
    nome: curso.nome,
    tipo: curso.tipo || "Superior",
    instituicao: curso.instituicao || "",
    cargahoraria: curso.cargahoraria || curso.cargaHoraria || 0,
    pontos: curso.pontos || 0
  }));
  
  const { error } = await supabase
    .from("cursos_civis")
    .insert(formattedCursos);
    
  if (error) throw error;
};

const processCondecoracoes = async (militarId: string, condecoracoes: any[]) => {
  if (!condecoracoes.length) return;
  
  const formattedCondecoracoes = condecoracoes.map(cond => ({
    militar_id: militarId,
    tipo: cond.tipo,
    descricao: cond.descricao || "",
    datarecebimento: cond.datarecebimento || cond.dataRecebimento,
    pontos: cond.pontos || 0
  }));
  
  const { error } = await supabase
    .from("condecoracoes")
    .insert(formattedCondecoracoes);
    
  if (error) throw error;
};

const processElogios = async (militarId: string, elogios: any[]) => {
  if (!elogios.length) return;
  
  const formattedElogios = elogios.map(elogio => ({
    militar_id: militarId,
    tipo: elogio.tipo,
    descricao: elogio.descricao || "",
    datarecebimento: elogio.datarecebimento || elogio.dataRecebimento,
    pontos: elogio.pontos || 0
  }));
  
  const { error } = await supabase
    .from("elogios")
    .insert(formattedElogios);
    
  if (error) throw error;
};

const processPunicoes = async (militarId: string, punicoes: any[]) => {
  if (!punicoes.length) return;
  
  const formattedPunicoes = punicoes.map(punicao => ({
    militar_id: militarId,
    tipo: punicao.tipo,
    descricao: punicao.descricao || "",
    datarecebimento: punicao.datarecebimento || punicao.dataRecebimento,
    pontos: punicao.pontos || 0
  }));
  
  const { error } = await supabase
    .from("punicoes")
    .insert(formattedPunicoes);
    
  if (error) throw error;
};

// Função para importar dados da extração de PDF
export const importDataFromPDFExtraction = async (militarId: string, data: any) => {
  try {
    console.log("Importing data for militar:", militarId);
    
    // Extract data from PDF extraction result
    const { cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes } = data;
    
    // Process all data in parallel for better performance
    await Promise.all([
      processCursosMilitares(militarId, cursosMilitares || []),
      processCursosCivis(militarId, cursosCivis || []),
      processCondecoracoes(militarId, condecoracoes || []),
      processElogios(militarId, elogios || []),
      processPunicoes(militarId, punicoes || [])
    ]);
    
    // Calculate and update total points
    let totalPontos = 0;
    
    // Sum points from all sources
    if (cursosMilitares) 
      totalPontos += cursosMilitares.reduce((sum: number, curso: any) => sum + (curso.pontos || 0), 0);
    
    if (cursosCivis)
      totalPontos += cursosCivis.reduce((sum: number, curso: any) => sum + (curso.pontos || 0), 0);
    
    if (condecoracoes)
      totalPontos += condecoracoes.reduce((sum: number, cond: any) => sum + (cond.pontos || 0), 0);
    
    if (elogios)
      totalPontos += elogios.reduce((sum: number, elogio: any) => sum + (elogio.pontos || 0), 0);
    
    // Subtract punishment points
    if (punicoes)
      totalPontos -= punicoes.reduce((sum: number, punicao: any) => sum + (punicao.pontos || 0), 0);
    
    // Create or update the ficha conceito with calculated points
    await createOrUpdateFichaConceito(militarId, totalPontos);
    
    toast({
      title: "Importação concluída",
      description: `Dados importados com sucesso. Total de pontos: ${totalPontos}`
    });
    
    return { success: true, totalPontos };
  } catch (error) {
    console.error("Error importing data from PDF:", error);
    toast({
      title: "Erro na importação",
      description: "Não foi possível importar os dados do documento.",
      variant: "destructive"
    });
    throw error;
  }
};
