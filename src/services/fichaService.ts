import { supabase } from "@/integrations/supabase/client";
import { FichaConceito } from "@/types";

export const getFichaConceito = async (militarId: string) => {
  try {
    const { data, error } = await supabase
      .from("fichas_conceito")
      .select("*")
      .eq("militar_id", militarId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar ficha de conceito:', error);
    throw error;
  }
};

export const salvarFichaConceito = async (
  militarId: string,
  totalPontos: number
) => {
  try {
    const { data, error } = await supabase
      .from("fichas_conceito")
      .upsert({ militar_id: militarId, totalpontos: totalPontos })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar ficha de conceito:', error);
    throw error;
  }
};
