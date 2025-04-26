
import { supabase } from "@/integrations/supabase/client";
import { Militar } from "@/types";

export const createMilitar = async (militar: Omit<Militar, "id">) => {
  const { data, error } = await supabase
    .from("militares")
    .insert({
      nome: militar.nomeCompleto,
      nomeguerra: militar.nomeGuerra,
      matricula: undefined, // será preenchido posteriormente
      posto: militar.posto,
      quadro: militar.quadro,
      unidade: undefined, // será preenchido posteriormente
      datanascimento: militar.dataNascimento,
      data_ingresso: militar.dataInclusao,
      dataultimapromocao: militar.dataUltimaPromocao,
      situacao: militar.situacao,
      email: militar.email,
      foto: militar.foto
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMilitar = async (id: string, militar: Partial<Militar>) => {
  const { data, error } = await supabase
    .from("militares")
    .update({
      nome: militar.nomeCompleto,
      nomeguerra: militar.nomeGuerra,
      posto: militar.posto,
      quadro: militar.quadro,
      datanascimento: militar.dataNascimento,
      data_ingresso: militar.dataInclusao,
      dataultimapromocao: militar.dataUltimaPromocao,
      situacao: militar.situacao,
      email: militar.email,
      foto: militar.foto
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMilitar = async (id: string) => {
  const { error } = await supabase
    .from("militares")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const getMilitarById = async (id: string) => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getMilitaresByQuadro = async (quadro: string) => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("quadro", quadro)
    .order("posto", { ascending: false });

  if (error) throw error;
  return data;
};

export const getMilitaresAtivos = async () => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("situacao", "ativo");

  if (error) throw error;
  return data;
};
