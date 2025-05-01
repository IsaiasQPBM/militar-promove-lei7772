
import { supabase } from "@/integrations/supabase/client";
import { PostoPatente, QuadroMilitar } from "@/types";

// Dados da Lei nº 7.772/2022
const vagasLei: Record<string, Record<string, number>> = {
  QOEM: {
    "Coronel": 6, // Atualizado conforme a Lei
    "Tenente-Coronel": 16, // Atualizado conforme a Lei
    "Major": 35, // Atualizado conforme a Lei
    "Capitão": 38, // Atualizado conforme a Lei
    "1º Tenente": 50, // Atualizado conforme a Lei
    "2º Tenente": 56 // Atualizado conforme a Lei
  },
  QOE: {
    "Tenente-Coronel": 2, // Atualizado conforme a Lei
    "Major": 2, // Atualizado conforme a Lei
    "Capitão": 2, // Atualizado conforme a Lei
    "1º Tenente": 2, // Atualizado conforme a Lei
    "2º Tenente": 2 // Atualizado conforme a Lei
  },
  QPBM: {
    "Subtenente": 63, // Atualizado conforme a Lei
    "1º Sargento": 102, // Atualizado conforme a Lei
    "2º Sargento": 130, // Atualizado conforme a Lei
    "3º Sargento": 150, // Atualizado conforme a Lei
    "Cabo": 240, // Atualizado conforme a Lei
    "Soldado": 428 // Atualizado conforme a Lei
  },
  QORR: {},
  QPRR: {}
};

// Função para verificar disponibilidade de vaga para um determinado posto e quadro
export const verificarDisponibilidadeVaga = async (
  posto: PostoPatente,
  quadro: QuadroMilitar
): Promise<{ disponivel: boolean; mensagem: string }> => {
  // Se o quadro for de reserva, sempre tem vaga disponível
  if (quadro === "QORR" || quadro === "QPRR") {
    return {
      disponivel: true,
      mensagem: "Quadro de reserva sem limite de vagas."
    };
  }

  try {
    // Buscar quantidade atual de militares ativos nesse posto e quadro
    const { data, error, count } = await supabase
      .from("militares")
      .select("*", { count: 'exact' })
      .eq("posto", posto)
      .eq("quadro", quadro)
      .eq("situacao", "ativo");

    if (error) throw error;

    // Verificar limite de vagas pela Lei
    const vagasDisponiveis = (vagasLei[quadro]?.[posto] || 0) - (count || 0);

    if (vagasDisponiveis > 0) {
      return {
        disponivel: true,
        mensagem: `Há ${vagasDisponiveis} vaga(s) disponível(is) para ${posto} no quadro ${quadro}.`
      };
    } else {
      return {
        disponivel: false,
        mensagem: `Não há vagas disponíveis para ${posto} no quadro ${quadro}. Limite atingido conforme Lei nº 7.772/2022.`
      };
    }
  } catch (error) {
    console.error("Erro ao verificar disponibilidade de vaga:", error);
    return {
      disponivel: false,
      mensagem: "Erro ao verificar disponibilidade de vaga. Tente novamente mais tarde."
    };
  }
};

// Função para obter contagem atual de militares por posto e quadro
export const obterContagemMilitares = async (): Promise<Record<string, Record<string, number>>> => {
  try {
    // Buscar todos os militares ativos
    const { data, error } = await supabase
      .from("militares")
      .select("posto, quadro")
      .eq("situacao", "ativo");

    if (error) throw error;

    // Inicializar objeto de contagem
    const contagem: Record<string, Record<string, number>> = {
      QOEM: {},
      QOE: {},
      QORR: {},
      QPBM: {},
      QPRR: {}
    };

    // Contar militares por posto e quadro
    data.forEach(militar => {
      const { posto, quadro } = militar;
      if (posto && quadro) {
        if (!contagem[quadro]) {
          contagem[quadro] = {};
        }

        if (!contagem[quadro][posto]) {
          contagem[quadro][posto] = 0;
        }

        contagem[quadro][posto]++;
      }
    });

    return contagem;
  } catch (error) {
    console.error("Erro ao obter contagem de militares:", error);
    throw error;
  }
};

// Função para calcular vagas disponíveis
export const calcularVagasDisponiveis = async (): Promise<Record<string, Record<string, number>>> => {
  try {
    const contagem = await obterContagemMilitares();
    const vagasDisponiveis: Record<string, Record<string, number>> = {
      QOEM: {},
      QOE: {},
      QORR: {},
      QPBM: {},
      QPRR: {}
    };

    // Calcular vagas disponíveis para cada quadro e posto
    Object.keys(vagasLei).forEach(quadro => {
      if (quadro === "QORR" || quadro === "QPRR") return; // Quadros de reserva não têm limite

      Object.keys(vagasLei[quadro]).forEach(posto => {
        const vagasLeiPosto = vagasLei[quadro][posto] || 0;
        const vagasOcupadas = contagem[quadro]?.[posto] || 0;
        vagasDisponiveis[quadro][posto] = Math.max(0, vagasLeiPosto - vagasOcupadas);
      });
    });

    return vagasDisponiveis;
  } catch (error) {
    console.error("Erro ao calcular vagas disponíveis:", error);
    throw error;
  }
};

// Função para obter o número total de vagas da Lei por quadro
export const obterTotalVagasLei = (): Record<string, number> => {
  const totais: Record<string, number> = {};
  
  Object.keys(vagasLei).forEach(quadro => {
    totais[quadro] = Object.values(vagasLei[quadro]).reduce((sum, num) => sum + num, 0);
  });
  
  return totais;
};
