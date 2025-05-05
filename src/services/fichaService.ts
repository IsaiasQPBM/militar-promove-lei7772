import { supabase } from "@/integrations/supabase/client";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao, FichaConceito, CursoMilitarTipo, FaltaAproveitamento } from "@/types";

// Cursos Militares
export const addCursoMilitar = async (curso: Omit<CursoMilitar, "id">) => {
  const { data, error } = await supabase
    .from("cursos_militares")
    .insert([{
      militar_id: curso.militarId,
      nome: curso.nome,
      tipo: curso.tipo,
      instituicao: curso.instituicao,
      cargahoraria: curso.cargaHoraria,
      pontos: curso.pontos,
      anexo: curso.anexo
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCursosMilitares = async (militarId: string) => {
  const { data, error } = await supabase
    .from("cursos_militares")
    .select("*")
    .eq("militar_id", militarId);

  if (error) throw error;

  // Transform the data to map database fields to our application types
  return data.map(curso => ({
    id: curso.id,
    militarId: curso.militar_id,
    nome: curso.nome,
    tipo: (curso.tipo || "Especialização") as CursoMilitarTipo,
    instituicao: curso.instituicao || "",
    cargaHoraria: curso.cargahoraria || 0,
    pontos: curso.pontos || 0,
    anexo: curso.anexo
  }));
};

// Bulk add cursos militares
export const addCursosMilitaresBulk = async (cursos: Omit<CursoMilitar, "id">[]) => {
  if (!cursos.length) return [];
  
  const { data, error } = await supabase
    .from("cursos_militares")
    .insert(cursos.map(curso => ({
      militar_id: curso.militarId,
      nome: curso.nome,
      tipo: curso.tipo,
      instituicao: curso.instituicao,
      cargahoraria: curso.cargaHoraria,
      pontos: curso.pontos,
      anexo: curso.anexo
    })))
    .select();

  if (error) throw error;
  return data;
};

// Cursos Civis
export const addCursoCivil = async (curso: Omit<CursoCivil, "id">) => {
  const { data, error } = await supabase
    .from("cursos_civis")
    .insert([{
      militar_id: curso.militarId,
      nome: curso.nome,
      tipo: curso.tipo,
      instituicao: curso.instituicao,
      cargahoraria: curso.cargaHoraria,
      pontos: curso.pontos,
      anexo: curso.anexo
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCursosCivis = async (militarId: string) => {
  const { data, error } = await supabase
    .from("cursos_civis")
    .select("*")
    .eq("militar_id", militarId);

  if (error) throw error;
  
  // Transform the data to map database fields to our application types
  return data.map(curso => ({
    id: curso.id,
    militarId: curso.militar_id,
    nome: curso.nome,
    tipo: (curso.tipo || "Superior") as CursoCivil["tipo"],
    instituicao: curso.instituicao || "",
    cargaHoraria: curso.cargahoraria || 0,
    pontos: curso.pontos || 0,
    anexo: curso.anexo
  }));
};

// Bulk add cursos civis
export const addCursosCivisBulk = async (cursos: Omit<CursoCivil, "id">[]) => {
  if (!cursos.length) return [];
  
  const { data, error } = await supabase
    .from("cursos_civis")
    .insert(cursos.map(curso => ({
      militar_id: curso.militarId,
      nome: curso.nome,
      tipo: curso.tipo,
      instituicao: curso.instituicao,
      cargahoraria: curso.cargaHoraria,
      pontos: curso.pontos,
      anexo: curso.anexo
    })))
    .select();

  if (error) throw error;
  return data;
};

// Condecorações
export const addCondecoracao = async (condecoracao: Omit<Condecoracao, "id">) => {
  const { data, error } = await supabase
    .from("condecoracoes")
    .insert([condecoracao])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCondecoracoes = async (militarId: string) => {
  const { data, error } = await supabase
    .from("condecoracoes")
    .select("*")
    .eq("militar_id", militarId);

  if (error) throw error;
  return data;
};

// Bulk add condecorações
export const addCondecoracoesBulk = async (condecoracoes: Omit<Condecoracao, "id">[]) => {
  if (!condecoracoes.length) return [];
  
  const { data, error } = await supabase
    .from("condecoracoes")
    .insert(condecoracoes)
    .select();

  if (error) throw error;
  return data;
};

// Elogios
export const addElogio = async (elogio: Omit<Elogio, "id">) => {
  const { data, error } = await supabase
    .from("elogios")
    .insert([elogio])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getElogios = async (militarId: string) => {
  const { data, error } = await supabase
    .from("elogios")
    .select("*")
    .eq("militar_id", militarId);

  if (error) throw error;
  return data;
};

// Bulk add elogios
export const addElogiosBulk = async (elogios: Omit<Elogio, "id">[]) => {
  if (!elogios.length) return [];
  
  const { data, error } = await supabase
    .from("elogios")
    .insert(elogios)
    .select();

  if (error) throw error;
  return data;
};

// Punições
export const addPunicao = async (punicao: Omit<Punicao, "id">) => {
  const { data, error } = await supabase
    .from("punicoes")
    .insert([punicao])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPunicoes = async (militarId: string) => {
  const { data, error } = await supabase
    .from("punicoes")
    .select("*")
    .eq("militar_id", militarId);

  if (error) throw error;
  return data;
};

// Bulk add punições
export const addPunicoesBulk = async (punicoes: Omit<Punicao, "id">[]) => {
  if (!punicoes.length) return [];
  
  const { data, error } = await supabase
    .from("punicoes")
    .insert(punicoes)
    .select();

  if (error) throw error;
  return data;
};

// Ficha Conceito
export const salvarFichaConceito = async (ficha: Omit<FichaConceito, "cursosMilitares" | "cursosCivis" | "condecoracoes" | "elogios" | "punicoes" | "faltasAproveitamento">) => {
  const { data, error } = await supabase
    .from("fichas_conceito")
    .upsert({
      militar_id: ficha.militarId,
      temposervicoquadro: ficha.tempoServicoQuadro,
      totalpontos: ficha.totalPontos
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFichaConceito = async (militarId: string) => {
  const { data, error } = await supabase
    .from("fichas_conceito")
    .select("*")
    .eq("militar_id", militarId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
  
  return data;
};

// Faltas de Aproveitamento
export const addFaltaAproveitamento = async (falta: { militar_id: string, descricao: string, pontos: number }) => {
  // Since the database table doesn't exist, we'll handle this differently
  // This is a placeholder until you create the actual table
  console.log("Falta de aproveitamento would be added:", falta);
  return { ...falta, id: Date.now().toString() };
};

export const getFaltasAproveitamento = async (militarId: string) => {
  // Since the database table doesn't exist, we'll return an empty array
  // This is a placeholder until you create the actual table
  console.log("Getting faltas aproveitamento for militar:", militarId);
  return [];
};

// Function to import all data from PDF extraction
export const importDataFromPDFExtraction = async (militarId: string, extractedData: {
  cursosMilitares?: Omit<CursoMilitar, "id" | "militarId">[],
  cursosCivis?: Omit<CursoCivil, "id" | "militarId">[],
  condecoracoes?: Omit<Condecoracao, "id" | "militarId">[],
  elogios?: Omit<Elogio, "id" | "militarId">[],
  punicoes?: Omit<Punicao, "id" | "militarId">[]
}) => {
  try {
    // Prepare data with militarId
    const cursosMilitares = (extractedData.cursosMilitares || []).map(curso => ({
      ...curso,
      militarId
    }));
    
    const cursosCivis = (extractedData.cursosCivis || []).map(curso => ({
      ...curso,
      militarId
    }));
    
    const condecoracoes = (extractedData.condecoracoes || []).map(cond => ({
      ...cond,
      militarId
    }));
    
    const elogios = (extractedData.elogios || []).map(elogio => ({
      ...elogio,
      militarId
    }));
    
    const punicoes = (extractedData.punicoes || []).map(punicao => ({
      ...punicao,
      militarId
    }));
    
    // Execute all imports in parallel
    const results = await Promise.all([
      cursosMilitares.length ? addCursosMilitaresBulk(cursosMilitares) : Promise.resolve([]),
      cursosCivis.length ? addCursosCivisBulk(cursosCivis) : Promise.resolve([]),
      condecoracoes.length ? addCondecoracoesBulk(condecoracoes) : Promise.resolve([]),
      elogios.length ? addElogiosBulk(elogios) : Promise.resolve([]),
      punicoes.length ? addPunicoesBulk(punicoes) : Promise.resolve([])
    ]);
    
    return {
      cursosMilitares: results[0],
      cursosCivis: results[1],
      condecoracoes: results[2],
      elogios: results[3],
      punicoes: results[4]
    };
  } catch (error) {
    console.error("Erro ao importar dados do PDF:", error);
    throw error;
  }
};
