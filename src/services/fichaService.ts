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

// Faltas de Aproveitamento - Handle as mock data since the table doesn't exist yet
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
