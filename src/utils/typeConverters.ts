
import { QuadroMilitar, PostoPatente, SituacaoMilitar, TipoSanguineo, Sexo } from "@/types";

// Converte string para QuadroMilitar
export const toQuadroMilitar = (quadro: string | null | undefined): QuadroMilitar => {
  if (quadro === "QOEM" || quadro === "QOE" || quadro === "QORR" || quadro === "QPBM" || quadro === "QPRR") {
    return quadro as QuadroMilitar;
  }
  // Valor padrão para evitar erros
  return "QPBM";
};

// Converte string para PostoPatente
export const toPostoPatente = (posto: string | null | undefined): PostoPatente => {
  const postos: PostoPatente[] = [
    "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
    "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
  ];
  
  if (posto && postos.includes(posto as PostoPatente)) {
    return posto as PostoPatente;
  }
  // Valor padrão para evitar erros
  return "Soldado";
};

// Converte string para SituacaoMilitar
export const toSituacaoMilitar = (situacao: string | null | undefined): SituacaoMilitar => {
  if (situacao === "ativo" || situacao === "inativo") {
    return situacao as SituacaoMilitar;
  }
  // Valor padrão para evitar erros
  return "ativo";
};

// Converte string para TipoSanguineo
export const toTipoSanguineo = (tipo: string | null | undefined): TipoSanguineo => {
  const tiposSanguineos: TipoSanguineo[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  if (tipo && tiposSanguineos.includes(tipo as TipoSanguineo)) {
    return tipo as TipoSanguineo;
  }
  // Valor padrão para evitar erros
  return "O+";
};

// Converte string para Sexo
export const toSexo = (sexo: string | null | undefined): Sexo => {
  if (sexo === "Masculino" || sexo === "Feminino") {
    return sexo as Sexo;
  }
  // Valor padrão para evitar erros
  return "Masculino";
};

// Funções para garantir que os tipos estão corretos ao enviar para o banco
export const fromQuadroMilitar = (quadro: QuadroMilitar): string => {
  return quadro;
};

export const fromPostoPatente = (posto: PostoPatente): string => {
  return posto;
};

export const fromSituacaoMilitar = (situacao: SituacaoMilitar): string => {
  return situacao;
};
