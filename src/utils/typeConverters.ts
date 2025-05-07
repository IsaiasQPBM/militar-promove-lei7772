
import { 
  PostoPatente, 
  QuadroMilitar, 
  SituacaoMilitar, 
  TipoSanguineo, 
  Sexo 
} from "@/types";

// Converter string para PostoPatente
export const toPostoPatente = (posto: string | null): PostoPatente => {
  if (!posto) return "Soldado";
  
  switch (posto) {
    case "Coronel": return "Coronel";
    case "Tenente-Coronel": return "Tenente-Coronel";
    case "Major": return "Major";
    case "Capitão": return "Capitão";
    case "1º Tenente": return "1º Tenente";
    case "2º Tenente": return "2º Tenente";
    case "Subtenente": return "Subtenente";
    case "1º Sargento": return "1º Sargento";
    case "2º Sargento": return "2º Sargento";
    case "3º Sargento": return "3º Sargento";
    case "Cabo": return "Cabo";
    case "Soldado": return "Soldado";
    default: return "Soldado";
  }
};

// Converter PostoPatente para string
export const fromPostoPatente = (posto: PostoPatente): string => {
  return posto;
};

// Converter string para QuadroMilitar
export const toQuadroMilitar = (quadro: string | null): QuadroMilitar => {
  if (!quadro) return "QOEM";
  
  switch (quadro) {
    case "QOEM": return "QOEM";
    case "QOE": return "QOE";
    case "QOBM-S": return "QOBM-S";
    case "QOBM-E": return "QOBM-E";
    case "QOBM-C": return "QOBM-C";
    case "QPBM": return "QPBM";
    case "QORR": return "QORR";
    case "QPRR": return "QPRR";
    default: return "QOEM";
  }
};

// Converter QuadroMilitar para string
export const fromQuadroMilitar = (quadro: QuadroMilitar): string => {
  return quadro;
};

// Converter string para SituacaoMilitar
export const toSituacaoMilitar = (situacao: string | null): SituacaoMilitar => {
  if (!situacao) return "ativo";
  
  switch (situacao) {
    case "ativo": return "ativo";
    case "inativo": return "inativo";
    case "afastado": return "afastado";
    case "reforma": return "reforma";
    default: return "ativo";
  }
};

// Converter SituacaoMilitar para string
export const fromSituacaoMilitar = (situacao: SituacaoMilitar): string => {
  return situacao;
};

// Converter string para TipoSanguineo
export const toTipoSanguineo = (tipo: string | null): TipoSanguineo => {
  if (!tipo) return "O+";
  
  switch (tipo) {
    case "A+": return "A+";
    case "A-": return "A-";
    case "B+": return "B+";
    case "B-": return "B-";
    case "AB+": return "AB+";
    case "AB-": return "AB-";
    case "O+": return "O+";
    case "O-": return "O-";
    default: return "O+";
  }
};

// Converter string para Sexo
export const toSexo = (sexo: string | null): Sexo => {
  if (!sexo) return "M";
  
  switch (sexo) {
    case "M": return "M";
    case "F": return "F";
    case "Masculino": return "Masculino";
    case "Feminino": return "Feminino";
    default: return "M";
  }
};

// Converter Sexo para string de exibição
export const toSexoDisplay = (sexo: Sexo): string => {
  switch (sexo) {
    case "M": return "Masculino";
    case "F": return "Feminino";
    case "Masculino": return "Masculino";
    case "Feminino": return "Feminino";
    default: return "Masculino";
  }
};
