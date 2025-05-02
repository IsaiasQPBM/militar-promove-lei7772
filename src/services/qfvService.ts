
import { supabase } from "@/integrations/supabase/client";
import { PostoPatente, QuadroMilitar } from "@/types";

// Dados da Lei nº 7.772/2022
const vagasLei: Record<string, Record<string, number>> = {
  // I – QUADRO DE OFICIAIS BOMBEIROS MILITAR COMBATENTES
  QOEM: {
    "Coronel": 6,
    "Tenente-Coronel": 16,
    "Major": 35,
    "Capitão": 38,
    "1º Tenente": 50,
    "2º Tenente": 56
  },
  // II – QUADRO DE OFICIAIS BOMBEIROS MILITAR DE SAÚDE
  "QOBM-S": {
    "Coronel": 0,
    "Tenente-Coronel": 1,
    "Major": 1,
    "Capitão": 2,
    "1º Tenente": 2,
    "2º Tenente": 6
  },
  // III – QUADRO DE OFICIAIS BOMBEIROS MILITAR ENGENHEIROS
  "QOBM-E": {
    "Coronel": 0,
    "Tenente-Coronel": 2,
    "Major": 2,
    "Capitão": 2,
    "1º Tenente": 2,
    "2º Tenente": 2
  },
  // IV- QUADRO DE OFICIAIS BOMBEIROS MILITAR COMPLEMENTARES
  "QOBM-C": {
    "Coronel": 0,
    "Tenente-Coronel": 0,
    "Major": 6,
    "Capitão": 24,
    "1º Tenente": 36,
    "2º Tenente": 41
  },
  // QOE - Mantendo para compatibilidade com dados existentes
  QOE: {
    "Coronel": 0,
    "Tenente-Coronel": 1,
    "Major": 2,
    "Capitão": 3,
    "1º Tenente": 5,
    "2º Tenente": 8
  },
  // V – QUADRO DE PRAÇAS BOMBEIROS MILITAR
  QPBM: {
    "Subtenente": 63,
    "1º Sargento": 102,
    "2º Sargento": 130,
    "3º Sargento": 150,
    "Cabo": 240,
    "Soldado": 428
  },
  // Quadros de reserva (sem limites)
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
      "QOBM-S": {},
      "QOBM-E": {},
      "QOBM-C": {},
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
      "QOBM-S": {},
      "QOBM-E": {},
      "QOBM-C": {},
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
