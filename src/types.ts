
// Add these types to your existing types.ts file

export type PontuacaoItem = {
  quantidade: number;
  valor: number;
  pontosPositivos: number;
  pontosNegativos: number;
};

export type PontuacaoLei5461 = {
  tempoServicoQuadro: PontuacaoItem;
  cursosMilitares: {
    especializacao: PontuacaoItem;
    csbm: PontuacaoItem;
    cfsd: PontuacaoItem;
    chc: PontuacaoItem;
    chsgt: PontuacaoItem;
    cas: PontuacaoItem;
    cho: PontuacaoItem;
    cfo: PontuacaoItem;
    cao: PontuacaoItem;
    csbm2: PontuacaoItem;
    [key: string]: PontuacaoItem;
  };
  cursosCivis: {
    superior: PontuacaoItem;
    especializacao: PontuacaoItem;
    mestrado: PontuacaoItem;
    doutorado: PontuacaoItem;
    [key: string]: PontuacaoItem;
  };
  condecoracoes: {
    governoFederal: PontuacaoItem;
    governoEstadual: PontuacaoItem;
    cbmepi: PontuacaoItem;
    [key: string]: PontuacaoItem;
  };
  elogios: {
    individual: PontuacaoItem;
    coletivo: PontuacaoItem;
    [key: string]: PontuacaoItem;
  };
  punicoes: {
    repreensao: PontuacaoItem;
    detencao: PontuacaoItem;
    prisao: PontuacaoItem;
    [key: string]: PontuacaoItem;
  };
  faltaAproveitamentoCursos: PontuacaoItem;
  somaTotal: number;
};

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
  | "QPBM";

export type SituacaoMilitar =
  | "ativo"
  | "inativo"
  | "afastado"
  | "reforma";

export type TipoSanguineo =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type Sexo =
  | "M"
  | "F";

export interface Militar {
  id: string;
  nome: string;
  nomeCompleto: string;
  nomeGuerra: string;
  posto: PostoPatente;
  quadro: QuadroMilitar;
  dataNascimento: string | null;
  dataInclusao: string | null;
  dataUltimaPromocao: string | null;
  situacao: SituacaoMilitar;
  email: string | null;
  foto: string | null;
  tipoSanguineo: TipoSanguineo;
  sexo: Sexo;
  unidade: string | null;
}

export interface CursoMilitar {
  id: string;
  militar_id: string;
  nome: string;
  tipo: string;
  instituicao: string;
  cargahoraria: number;
  pontos: number;
  anexo?: string;
}

export interface CursoCivil {
  id: string;
  militar_id: string;
  nome: string;
  tipo: string;
  instituicao: string;
  cargahoraria: number;
  pontos: number;
  anexo?: string;
}

export interface Condecoracao {
  id: string;
  militar_id: string;
  tipo: string;
  descricao: string;
  datarecebimento: string | null;
  pontos: number;
  anexo?: string;
}

export interface Elogio {
  id: string;
  militar_id: string;
  tipo: string;
  descricao: string;
  datarecebimento: string | null;
  pontos: number;
  anexo?: string;
}

export interface Punicao {
  id: string;
  militar_id: string;
  tipo: string;
  descricao: string;
  datarecebimento: string | null;
  pontos: number;
  anexo?: string;
}

export type CriterioPromocao = 
  | "Antiguidade" 
  | "Merecimento" 
  | "Posto máximo" 
  | "Graduação máxima";

export interface Promocao {
  id: string;
  militarId: string;
  criterio: CriterioPromocao;
  dataPromocao: string | null;
  publicada: boolean;
  cargo?: string;
  anexoDocumento?: string;
}
