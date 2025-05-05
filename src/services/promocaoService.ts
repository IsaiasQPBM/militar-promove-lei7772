
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

// Função para verificar se o militar está no período de inclusão no quadro de acesso
export const verificarPeriodoQuadroAcesso = () => {
  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1; // Janeiro é 0
  
  // Períodos de inclusão no quadro de acesso: 18 de julho e 23 de dezembro
  if ((dia === 18 && mes === 7) || (dia === 23 && mes === 12)) {
    return true;
  }
  
  return false;
};

// Função para calcular a data mais próxima de inclusão no quadro de acesso
export const calcularProximaDataQuadroAcesso = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  
  // Datas de inclusão no quadro de acesso
  const dataJulho = new Date(ano, 6, 18); // 18 de julho (mês é 0-indexed)
  const dataDezembro = new Date(ano, 11, 23); // 23 de dezembro
  
  // Se já passamos de 23 de dezembro, a próxima data será 18 de julho do próximo ano
  if (hoje > dataDezembro) {
    return new Date(ano + 1, 6, 18);
  }
  
  // Se já passamos de 18 de julho, a próxima data será 23 de dezembro
  if (hoje > dataJulho) {
    return dataDezembro;
  }
  
  // Caso contrário, a próxima data será 18 de julho
  return dataJulho;
};

// Função para obter todos os critérios de promoção baseados no posto atual
export const getCriteriosPromocao = (posto: string, quadro: string) => {
  // Critérios para Oficiais (Lei 7.772/2022)
  if (["Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente"].includes(posto)) {
    return [
      "Estar no posto atual pelo tempo mínimo exigido por lei",
      "Possuir aptidão física comprovada em teste específico",
      "Estar classificado no comportamento excepcional para praças",
      "Ter conceito profissional e moral favoráveis",
      "Não estar sub judice ou respondendo a processo administrativo",
      "Não estar de licença para tratar de interesse particular",
      "Ter sido aprovado no curso exigido para o posto",
      "Entrar no quadro de acesso por merecimento ou antiguidade conforme o posto",
      "Para promoções a Major, Tenente-Coronel e Coronel, deve constar no Quadro de Acesso por Merecimento (QAM)",
      "Para Capitães e Tenentes, prevalecem as promoções por antiguidade",
      "Para inclusão no Quadro de Acesso, as datas são 18 de julho e 23 de dezembro"
    ];
  } 
  // Critérios para Praças (Lei 7.772/2022)
  else {
    return [
      "Estar na graduação atual pelo tempo mínimo exigido por lei",
      "Possuir aptidão física comprovada em teste específico",
      "Estar classificado no comportamento excepcional",
      "Ter conceito profissional e moral favoráveis",
      "Não estar sub judice ou respondendo a processo administrativo",
      "Não estar de licença para tratar de interesse particular",
      "Ter sido aprovado no curso exigido para a graduação",
      "Para Subtenentes e 1º Sargentos, constar no Quadro de Acesso por Merecimento (QAM)",
      "Para demais graduações, prevalecem as promoções por antiguidade",
      "Para inclusão no Quadro de Acesso, as datas são 18 de julho e 23 de dezembro"
    ];
  }
};
