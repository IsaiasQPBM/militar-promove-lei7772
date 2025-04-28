
import { supabase } from "@/integrations/supabase/client";
import { Militar, QuadroMilitar, SituacaoMilitar, PostoPatente } from "@/types";

export const createMilitar = async (militar: Omit<Militar, "id">) => {
  console.log("Enviando para o Supabase:", militar);
  
  // Map the Militar type fields to the database column names
  const { data, error } = await supabase
    .from("militares")
    .insert({
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
    .select()
    .single();

  if (error) {
    console.error("Erro no Supabase:", error);
    throw error;
  }
  
  console.log("Resposta do Supabase:", data);
  
  // Convert database column names back to Militar type field names
  return {
    id: data.id,
    nomeCompleto: data.nome,
    nomeGuerra: data.nomeguerra,
    posto: data.posto as PostoPatente,
    quadro: data.quadro as QuadroMilitar,
    dataNascimento: data.datanascimento,
    dataInclusao: data.data_ingresso,
    dataUltimaPromocao: data.dataultimapromocao,
    situacao: data.situacao as SituacaoMilitar,
    email: data.email,
    foto: data.foto
  };
};

export const updateMilitar = async (id: string, militar: Partial<Militar>) => {
  const updateData: any = {};
  
  // Only map fields that are provided in the update
  if (militar.nomeCompleto !== undefined) updateData.nome = militar.nomeCompleto;
  if (militar.nomeGuerra !== undefined) updateData.nomeguerra = militar.nomeGuerra;
  if (militar.posto !== undefined) updateData.posto = militar.posto;
  if (militar.quadro !== undefined) updateData.quadro = militar.quadro;
  if (militar.dataNascimento !== undefined) updateData.datanascimento = militar.dataNascimento;
  if (militar.dataInclusao !== undefined) updateData.data_ingresso = militar.dataInclusao;
  if (militar.dataUltimaPromocao !== undefined) updateData.dataultimapromocao = militar.dataUltimaPromocao;
  if (militar.situacao !== undefined) updateData.situacao = militar.situacao;
  if (militar.email !== undefined) updateData.email = militar.email;
  if (militar.foto !== undefined) updateData.foto = militar.foto;

  const { data, error } = await supabase
    .from("militares")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  
  // Convert database column names back to Militar type field names
  return {
    id: data.id,
    nomeCompleto: data.nome,
    nomeGuerra: data.nomeguerra,
    posto: data.posto as PostoPatente,
    quadro: data.quadro as QuadroMilitar,
    dataNascimento: data.datanascimento,
    dataInclusao: data.data_ingresso,
    dataUltimaPromocao: data.dataultimapromocao,
    situacao: data.situacao as SituacaoMilitar,
    email: data.email,
    foto: data.foto
  };
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
  
  // Convert database column names to Militar type field names
  return {
    id: data.id,
    nomeCompleto: data.nome,
    nomeGuerra: data.nomeguerra,
    posto: data.posto as PostoPatente,
    quadro: data.quadro as QuadroMilitar,
    dataNascimento: data.datanascimento,
    dataInclusao: data.data_ingresso,
    dataUltimaPromocao: data.dataultimapromocao,
    situacao: data.situacao as SituacaoMilitar,
    email: data.email,
    foto: data.foto
  };
};

export const getMilitaresByQuadro = async (quadro: string) => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("quadro", quadro)
    .order("posto", { ascending: false });

  if (error) throw error;
  
  // Convert database column names to Militar type field names for each item in the array
  return data.map(item => ({
    id: item.id,
    nomeCompleto: item.nome,
    nomeGuerra: item.nomeguerra,
    posto: item.posto as PostoPatente,
    quadro: item.quadro as QuadroMilitar,
    dataNascimento: item.datanascimento,
    dataInclusao: item.data_ingresso,
    dataUltimaPromocao: item.dataultimapromocao,
    situacao: item.situacao as SituacaoMilitar,
    email: item.email,
    foto: item.foto
  }));
};

export const getMilitaresAtivos = async () => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("situacao", "ativo");

  if (error) throw error;
  
  // Convert database column names to Militar type field names for each item in the array
  return data.map(item => ({
    id: item.id,
    nomeCompleto: item.nome,
    nomeGuerra: item.nomeguerra,
    posto: item.posto as PostoPatente,
    quadro: item.quadro as QuadroMilitar,
    dataNascimento: item.datanascimento,
    dataInclusao: item.data_ingresso,
    dataUltimaPromocao: item.dataultimapromocao,
    situacao: item.situacao as SituacaoMilitar,
    email: item.email,
    foto: item.foto
  }));
};
