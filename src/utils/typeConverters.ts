
import { QuadroMilitar, PostoPatente, SituacaoMilitar } from "@/types";

// Converte string para QuadroMilitar
export const toQuadroMilitar = (quadro: string): QuadroMilitar => {
  if (quadro === "QOEM" || quadro === "QOE" || quadro === "QORR" || quadro === "QPBM" || quadro === "QPRR") {
    return quadro as QuadroMilitar;
  }
  // Valor padrão para evitar erros
  return "QPBM";
};

// Converte string para PostoPatente
export const toPostoPatente = (posto: string): PostoPatente => {
  const postos = [
    "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
    "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
  ];
  
  if (postos.includes(posto)) {
    return posto as PostoPatente;
  }
  // Valor padrão para evitar erros
  return "Soldado";
};

// Converte string para SituacaoMilitar
export const toSituacaoMilitar = (situacao: string): SituacaoMilitar => {
  if (situacao === "ativo" || situacao === "inativo") {
    return situacao as SituacaoMilitar;
  }
  // Valor padrão para evitar erros
  return "ativo";
};
