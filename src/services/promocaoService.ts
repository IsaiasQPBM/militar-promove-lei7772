
import { supabase } from "@/integrations/supabase/client";
import { Promocao } from "@/types";

export const createPromocao = async (promocao: Omit<Promocao, "id">) => {
  const { data, error } = await supabase
    .from("promocoes")
    .insert({
      militar_id: promocao.militarId,
      tipo_promocao: promocao.criterio,
      data_promocao: promocao.dataPromocao,
      publicada: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPromocoesByMilitar = async (militarId: string) => {
  const { data, error } = await supabase
    .from("promocoes")
    .select("*")
    .eq("militar_id", militarId)
    .order("data_promocao", { ascending: false });

  if (error) throw error;
  return data;
};
