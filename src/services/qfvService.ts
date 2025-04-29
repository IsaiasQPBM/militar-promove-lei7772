
import { supabase } from "@/integrations/supabase/client";
import { PostoPatente, QuadroMilitar } from "@/types";
import { fromPostoPatente, fromQuadroMilitar } from "@/utils/typeConverters";

export interface VagaInfo {
  posto: string;
  previstas: number;
  existentes: number;
  disponiveis: number;
}

/**
 * Busca todas as informações de vagas previstas e existentes
 */
export const getVagasInfo = async (): Promise<{ 
  vagasOficiais: VagaInfo[],
  vagasPracas: VagaInfo[]
}> => {
  // Buscar todos militares ativos para contar vagas ocupadas
  const { data: militares, error } = await supabase
    .from("militares")
    .select("*")
    .eq("situacao", "ativo");

  if (error) throw error;

  // Dados de vagas previstas (conforme definido na legislação ou configuração)
  const vagasPrevistas = {
    oficiais: [
      { posto: "Coronel", previstas: 8 },
      { posto: "Tenente-Coronel", previstas: 12 },
      { posto: "Major", previstas: 20 },
      { posto: "Capitão", previstas: 35 },
      { posto: "1º Tenente", previstas: 45 },
      { posto: "2º Tenente", previstas: 50 }
    ],
    pracas: [
      { posto: "Subtenente", previstas: 25 },
      { posto: "1º Sargento", previstas: 40 },
      { posto: "2º Sargento", previstas: 65 },
      { posto: "3º Sargento", previstas: 90 },
      { posto: "Cabo", previstas: 130 },
      { posto: "Soldado", previstas: 350 }
    ]
  };

  // Contar vagas ocupadas (militares ativos por posto)
  const contarMilitaresPorPosto = (posto: string) => {
    return militares ? militares.filter(m => m.posto === posto).length : 0;
  };

  // Processar vagas de oficiais
  const vagasOficiais = vagasPrevistas.oficiais.map(vaga => {
    const existentes = contarMilitaresPorPosto(vaga.posto);
    return {
      posto: vaga.posto,
      previstas: vaga.previstas,
      existentes: existentes,
      disponiveis: vaga.previstas - existentes
    };
  });

  // Processar vagas de praças
  const vagasPracas = vagasPrevistas.pracas.map(vaga => {
    const existentes = contarMilitaresPorPosto(vaga.posto);
    return {
      posto: vaga.posto,
      previstas: vaga.previstas,
      existentes: existentes,
      disponiveis: vaga.previstas - existentes
    };
  });

  return {
    vagasOficiais,
    vagasPracas
  };
};

/**
 * Verifica se há vaga disponível para determinado posto/quadro
 */
export const verificarDisponibilidadeVaga = async (
  posto: PostoPatente,
  quadro: QuadroMilitar
): Promise<{ disponivel: boolean, mensagem: string }> => {
  try {
    const postoFormatado = fromPostoPatente(posto);
    const quadroFormatado = fromQuadroMilitar(quadro);
    
    // Consultar quantidade de militares ativos com este posto/quadro
    const { count: existentes, error } = await supabase
      .from("militares")
      .select("*", { count: "exact", head: false })
      .eq("posto", postoFormatado)
      .eq("quadro", quadroFormatado)
      .eq("situacao", "ativo");
    
    if (error) throw error;

    // Obter a quantidade de vagas previstas para este posto
    let vagas: { posto: string; previstas: number; }[] = [];
    
    if (quadro === "QOEM" || quadro === "QOE") {
      vagas = [
        { posto: "Coronel", previstas: 8 },
        { posto: "Tenente-Coronel", previstas: 12 },
        { posto: "Major", previstas: 20 },
        { posto: "Capitão", previstas: 35 },
        { posto: "1º Tenente", previstas: 45 },
        { posto: "2º Tenente", previstas: 50 }
      ];
    } else if (quadro === "QPBM") {
      vagas = [
        { posto: "Subtenente", previstas: 25 },
        { posto: "1º Sargento", previstas: 40 },
        { posto: "2º Sargento", previstas: 65 },
        { posto: "3º Sargento", previstas: 90 },
        { posto: "Cabo", previstas: 130 },
        { posto: "Soldado", previstas: 350 }
      ];
    } else {
      // Para quadros da reserva não há limite de vagas
      return { 
        disponivel: true, 
        mensagem: "Sem limite de vagas para quadros da reserva." 
      };
    }
    
    const vagaInfo = vagas.find(v => v.posto === postoFormatado);
    
    if (!vagaInfo) {
      return { 
        disponivel: false, 
        mensagem: `Não foi possível encontrar informações sobre vagas para ${postoFormatado} no quadro ${quadroFormatado}.`
      };
    }
    
    const vagasDisponiveis = vagaInfo.previstas - (existentes || 0);
    
    if (vagasDisponiveis <= 0) {
      return {
        disponivel: false,
        mensagem: `Não há vagas disponíveis para ${postoFormatado} no quadro ${quadroFormatado}. Vagas previstas: ${vagaInfo.previstas}, vagas ocupadas: ${existentes}.`
      };
    }
    
    return {
      disponivel: true,
      mensagem: `Há ${vagasDisponiveis} vaga(s) disponível(is) para ${postoFormatado} no quadro ${quadroFormatado}.`
    };
    
  } catch (error) {
    console.error("Erro ao verificar disponibilidade de vaga:", error);
    return {
      disponivel: false,
      mensagem: "Ocorreu um erro ao verificar a disponibilidade de vagas."
    };
  }
};
