
import { supabase } from "@/integrations/supabase/client";
import { Promocao } from "@/types";

export const getPromocoesByMilitar = async (militarId: string) => {
  const { data, error } = await supabase
    .from("promocoes")
    .select("*")
    .eq("militar_id", militarId)
    .order("data_promocao", { ascending: false });

  if (error) throw error;
  return data;
};
