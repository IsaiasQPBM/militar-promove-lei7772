
import { PostoPatente, Militar } from "@/types";
import { addYears, differenceInDays, differenceInMonths, parseISO } from "date-fns";

// Interface para previsão de promoção
export interface PrevisaoPromocao {
  militarId: string;
  nome: string;
  posto: PostoPatente;
  proximoPosto: PostoPatente | null;
  dataUltimaPromocao: Date;
  dataProximaPromocao: Date | null;
  tempoRestante: string;
  criterio: string;
  pontuacao?: number; // Adicionado para integração com a ficha de conceito
}

// Interface com tempo mínimo para promoções por posto
interface TempoPromocoesInterface {
  [key: string]: {
    tempoMinimo: number;
    criterio: string;
    proximoPosto: PostoPatente | null;
  };
}

// Tempo mínimo para promoções de Oficiais conforme Lei 7.772/2022
export const tempoPromocoesOficiais: TempoPromocoesInterface = {
  "2º Tenente": { tempoMinimo: 2, criterio: "Antiguidade", proximoPosto: "1º Tenente" },
  "1º Tenente": { tempoMinimo: 4, criterio: "Antiguidade", proximoPosto: "Capitão" },
  "Capitão": { tempoMinimo: 4, criterio: "Merecimento", proximoPosto: "Major" },
  "Major": { tempoMinimo: 3, criterio: "Merecimento", proximoPosto: "Tenente-Coronel" },
  "Tenente-Coronel": { tempoMinimo: 2, criterio: "Merecimento", proximoPosto: "Coronel" },
  "Coronel": { tempoMinimo: 0, criterio: "Posto máximo", proximoPosto: null }
};

// Tempo mínimo para promoções de Praças conforme Lei 7.772/2022
export const tempoPromocoesPracas: TempoPromocoesInterface = {
  "Soldado": { tempoMinimo: 2, criterio: "Antiguidade", proximoPosto: "Cabo" },
  "Cabo": { tempoMinimo: 3, criterio: "Antiguidade", proximoPosto: "3º Sargento" },
  "3º Sargento": { tempoMinimo: 4, criterio: "Antiguidade", proximoPosto: "2º Sargento" },
  "2º Sargento": { tempoMinimo: 4, criterio: "Merecimento", proximoPosto: "1º Sargento" },
  "1º Sargento": { tempoMinimo: 3, criterio: "Merecimento", proximoPosto: "Subtenente" },
  "Subtenente": { tempoMinimo: 0, criterio: "Graduação máxima", proximoPosto: null }
};

export const calcularPrevisaoIndividual = (militar: Militar): PrevisaoPromocao => {
  const isOficial = ["QOEM", "QOE", "QORR"].includes(militar.quadro);
  const tabela = isOficial ? tempoPromocoesOficiais : tempoPromocoesPracas;
  
  const infoProximaPromocao = tabela[militar.posto] || { 
    tempoMinimo: 0, 
    criterio: "Sem informação", 
    proximoPosto: null 
  };
  
  // Parse ISO date string to Date object
  const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
  let dataProximaPromocao: Date | null = null;
  let tempoRestante = "N/A";
  
  if (infoProximaPromocao.proximoPosto) {
    dataProximaPromocao = addYears(dataUltimaPromocao, infoProximaPromocao.tempoMinimo);
    
    const hoje = new Date();
    const diasRestantes = differenceInDays(dataProximaPromocao, hoje);
    const mesesRestantes = differenceInMonths(dataProximaPromocao, hoje);
    
    if (diasRestantes < 0) {
      tempoRestante = "Promoção disponível";
    } else if (mesesRestantes < 1) {
      tempoRestante = `${diasRestantes} dias`;
    } else if (mesesRestantes < 12) {
      tempoRestante = `${mesesRestantes} meses`;
    } else {
      const anos = Math.floor(mesesRestantes / 12);
      const mesesRestantesFinal = mesesRestantes % 12;
      tempoRestante = `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantesFinal} ${mesesRestantesFinal === 1 ? 'mês' : 'meses'}`;
    }
  }
  
  return {
    militarId: militar.id,
    nome: militar.nomeGuerra,
    posto: militar.posto,
    proximoPosto: infoProximaPromocao.proximoPosto,
    dataUltimaPromocao,
    dataProximaPromocao,
    tempoRestante,
    criterio: infoProximaPromocao.criterio,
    pontuacao: 0 // Valor padrão, será atualizado posteriormente
  };
};

export const getBadgeVariant = (tempoRestante: string): string => {
  if (tempoRestante === "Promoção disponível") {
    return "bg-green-500 hover:bg-green-600";
  } else if (tempoRestante.includes("dias") || tempoRestante.includes("mês") || tempoRestante.includes("meses") && !tempoRestante.includes("ano")) {
    return "bg-yellow-500 hover:bg-yellow-600";
  } else {
    return "bg-blue-500 hover:bg-blue-600";
  }
};
