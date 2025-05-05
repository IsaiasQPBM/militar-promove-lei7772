
import { supabase } from "@/integrations/supabase/client";
import { CursoCivil, CursoMilitar, Condecoracao, Elogio, Punicao, TipoSanguineo, Sexo } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Create or update FichaConceito for a military
export const createOrUpdateFichaConceito = async (militarId: string, totalPontos: number) => {
  try {
    // Check if the ficha already exists
    const { data: existingFicha, error: fetchError } = await supabase
      .from("fichas_conceito")
      .select("id")
      .eq("militar_id", militarId)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }
    
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

// Function to save ficha conceito with tempo de serviço
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
    // Check if the ficha already exists
    const { data: existingFicha, error: fetchError } = await supabase
      .from("fichas_conceito")
      .select("id")
      .eq("militar_id", militarId)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }
    
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

// Function for PDF extraction and import
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

// Helper functions to process each data type
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
