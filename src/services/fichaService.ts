
import { supabase } from "@/integrations/supabase/client";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";

// Cursos Militares
export const addCursoMilitar = async (curso: Omit<CursoMilitar, "id">) => {
  const { data, error } = await supabase
    .from("cursos_militares")
    .insert([curso])
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
  return data;
};

// Cursos Civis
export const addCursoCivil = async (curso: Omit<CursoCivil, "id">) => {
  const { data, error } = await supabase
    .from("cursos_civis")
    .insert([curso])
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
