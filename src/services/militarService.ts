
import { supabase } from "@/integrations/supabase/client";
import { Militar, QuadroMilitar, SituacaoMilitar, PostoPatente } from "@/types";
import { 
  toQuadroMilitar, 
  toPostoPatente, 
  toSituacaoMilitar,
  fromQuadroMilitar,
  fromPostoPatente,
  fromSituacaoMilitar
} from "@/utils/typeConverters";
import { verificarDisponibilidadeVaga } from "./qfvService";

// Função auxiliar para mapear dados do militar do banco para o tipo Militar
const mapDatabaseToMilitar = (data: any): Militar => {
  return {
    id: data.id,
    nomeCompleto: data.nome,
    nomeGuerra: data.nomeguerra,
    posto: toPostoPatente(data.posto),
    quadro: toQuadroMilitar(data.quadro),
    dataNascimento: data.datanascimento,
    dataInclusao: data.data_ingresso,
    dataUltimaPromocao: data.dataultimapromocao,
    situacao: toSituacaoMilitar(data.situacao),
    email: data.email,
    foto: data.foto
  };
};

export const createMilitar = async (militar: Omit<Militar, "id">) => {
  console.log("Verificando disponibilidade de vaga...");
  
  // Verificar se há vaga disponível para o posto/quadro
  if (militar.situacao === "ativo" && (militar.quadro === "QOEM" || militar.quadro === "QOE" || militar.quadro === "QPBM")) {
    const { disponivel, mensagem } = await verificarDisponibilidadeVaga(militar.posto, militar.quadro);
    
    if (!disponivel) {
      console.error("Não há vagas disponíveis:", mensagem);
      throw new Error(mensagem);
    }
    
    console.log("Vaga disponível:", mensagem);
  }
  
  console.log("Enviando para o Supabase:", militar);
  
  // Map the Militar type fields to the database column names
  const { data, error } = await supabase
    .from("militares")
    .insert({
      nome: militar.nomeCompleto,
      nomeguerra: militar.nomeGuerra,
      posto: fromPostoPatente(militar.posto),
      quadro: fromQuadroMilitar(militar.quadro),
      datanascimento: militar.dataNascimento,
      data_ingresso: militar.dataInclusao,
      dataultimapromocao: militar.dataUltimaPromocao,
      situacao: fromSituacaoMilitar(militar.situacao),
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
  return mapDatabaseToMilitar(data);
};

export const updateMilitar = async (id: string, militar: Partial<Militar>) => {
  const updateData: any = {};
  
  // Only map fields that are provided in the update
  if (militar.nomeCompleto !== undefined) updateData.nome = militar.nomeCompleto;
  if (militar.nomeGuerra !== undefined) updateData.nomeguerra = militar.nomeGuerra;
  if (militar.posto !== undefined) updateData.posto = fromPostoPatente(militar.posto);
  if (militar.quadro !== undefined) updateData.quadro = fromQuadroMilitar(militar.quadro);
  if (militar.dataNascimento !== undefined) updateData.datanascimento = militar.dataNascimento;
  if (militar.dataInclusao !== undefined) updateData.data_ingresso = militar.dataInclusao;
  if (militar.dataUltimaPromocao !== undefined) updateData.dataultimapromocao = militar.dataUltimaPromocao;
  if (militar.situacao !== undefined) updateData.situacao = fromSituacaoMilitar(militar.situacao);
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
  return mapDatabaseToMilitar(data);
};

export const deleteMilitar = async (id: string) => {
  const { error } = await supabase
    .from("militares")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const getMilitarById = async (id: string): Promise<Militar | null> => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - militar not found
      return null;
    }
    throw error;
  }
  
  // Convert database column names to Militar type field names
  return mapDatabaseToMilitar(data);
};

export const getMilitaresByQuadro = async (quadro: string): Promise<Militar[]> => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("quadro", quadro)
    .order("posto", { ascending: false });

  if (error) throw error;
  
  // Convert database column names to Militar type field names for each item in the array
  return data.map(item => mapDatabaseToMilitar(item));
};

export const getMilitaresAtivos = async (): Promise<Militar[]> => {
  const { data, error } = await supabase
    .from("militares")
    .select("*")
    .eq("situacao", "ativo");

  if (error) throw error;
  
  // Convert database column names to Militar type field names for each item in the array
  return data.map(item => mapDatabaseToMilitar(item));
};
