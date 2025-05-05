
export interface FichaConceito {
  id: string;
  militar_id: string;
  totalpontos: number;
}

export type CursoMilitarTipo = "Especialização" | "CSBM" | "CFSD" | "CHC" | "CHSGT" | "CAS" | "CHO" | "CFO" | "CAO" | "CSBM2" | "Outro";

export type CursoCivilTipo = "Superior" | "Especialização" | "Mestrado" | "Doutorado" | "Outro";

export interface CursoMilitar {
  id: string;
  militar_id: string;
  nome: string;
  tipo: string;
  instituicao: string;
  cargahoraria: number;
  pontos: number;
}

export interface CursoCivil {
  id: string;
  militar_id: string;
  nome: string;
  tipo: string;
  instituicao: string;
  cargahoraria: number;
  pontos: number;
}

export interface Condecoracao {
  id: string;
  militar_id: string;
  tipo: string;
  descricao: string;
  datarecebimento: string;
  pontos: number;
}

export interface Elogio {
  id: string;
  militar_id: string;
  tipo: string;
  descricao: string;
  datarecebimento: string;
  pontos: number;
}

export interface Punicao {
  id: string;
  militar_id: string;
  tipo: string;
  descricao: string;
  datarecebimento: string;
  pontos: number;
}

export type PontuacaoItemType = {
  quantidade: number;
  valor: number;
  pontosPositivos: number;
  pontosNegativos?: number;
};

export interface PontuacaoLei5461 {
  tempoServicoQuadro: PontuacaoItemType;
  cursosMilitares: {
    especializacao: PontuacaoItemType;
    csbm: PontuacaoItemType;
    cfsd: PontuacaoItemType;
    chc: PontuacaoItemType;
    chsgt: PontuacaoItemType;
    cas: PontuacaoItemType;
    cho: PontuacaoItemType;
    cfo: PontuacaoItemType;
    cao: PontuacaoItemType;
    csbm2: PontuacaoItemType;
  };
  cursosCivis: {
    superior: PontuacaoItemType;
    especializacao: PontuacaoItemType;
    mestrado: PontuacaoItemType;
    doutorado: PontuacaoItemType;
  };
  condecoracoes: {
    governoFederal: PontuacaoItemType;
    governoEstadual: PontuacaoItemType;
    cbmepi: PontuacaoItemType;
  };
  elogios: {
    individual: PontuacaoItemType;
    coletivo: PontuacaoItemType;
  };
  punicoes: {
    repreensao: PontuacaoItemType;
    detencao: PontuacaoItemType;
    prisao: PontuacaoItemType;
  };
  faltaAproveitamentoCursos: PontuacaoItemType;
  somaTotal: number;
}

export type PostoPatente = 
  | "Coronel" 
  | "Tenente-Coronel" 
  | "Major" 
  | "Capitão" 
  | "1º Tenente" 
  | "2º Tenente"
  | "Subtenente"
  | "1º Sargento"
  | "2º Sargento"
  | "3º Sargento"
  | "Cabo"
  | "Soldado";

export type QuadroMilitar = 
  | "QOEM" 
  | "QOE" 
  | "QOBM-S"
  | "QOBM-E"
  | "QOBM-C"
  | "QORR" 
  | "QPBM" 
  | "QPRR";

export type CriterioPromocao = "Antiguidade" | "Merecimento" | "Posto máximo" | "Graduação máxima";

export type SituacaoMilitar = "ativo" | "inativo";

export type TipoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// Modify Sexo type to include display values to avoid type errors
export type Sexo = "M" | "F" | "Masculino" | "Feminino";
export type SexoDisplay = "Masculino" | "Feminino";

// Updated to make nome, nomeCompleto, and nomeGuerra consistent
export interface Militar {
  id: string;
  nome: string; // Original nome from database - required
  nomeCompleto: string; // Same as nome for UI consistency
  nomeGuerra: string;
  posto: PostoPatente;
  quadro: QuadroMilitar;
  dataNascimento: string;
  dataInclusao: string;
  dataUltimaPromocao: string;
  situacao: SituacaoMilitar;
  tipoSanguineo: TipoSanguineo;
  email?: string;
  foto?: string;
  sexo: Sexo;
  unidade?: string;
}

export interface Promocao {
  id: string;
  militarId: string;
  criterio: CriterioPromocao;
  dataPromocao: string;
  publicada?: boolean;
  cargo?: string; // Optional field for UI
  anexoDocumento?: string; // Optional field for UI
}
