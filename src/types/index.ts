
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type QuadroMilitar = 
  | "QOEM"    // Estado-Maior
  | "QOE"     // Especialistas
  | "QOBM-S"  // Saúde
  | "QOBM-E"  // Engenheiros
  | "QOBM-C"  // Complementares
  | "QORR"    // Reserva Remunerada para Oficiais
  | "QPBM"    // Praças
  | "QPRR"    // Reserva Remunerada para Praças
  ;

export type TipoQuadro = "oficiais" | "praças" | "reserva";

export type PostoPatente = 
  // Oficiais
  | "Coronel"
  | "Tenente-Coronel"
  | "Major"
  | "Capitão"
  | "1º Tenente"
  | "2º Tenente"
  // Praças
  | "Subtenente"
  | "1º Sargento"
  | "2º Sargento"
  | "3º Sargento"
  | "Cabo"
  | "Soldado";

export type SituacaoMilitar = "ativo" | "inativo";

export type TipoSanguineo =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type Sexo = "Masculino" | "Feminino";

export type CriterioPromocao = 
  | "Antiguidade" 
  | "Merecimento" 
  | "Por ato de bravura" 
  | "Post-mortem" 
  | "Em ressarcimento de preterição";

// Tipos de cursos militares conforme a Lei 5461
export type CursoMilitarTipo =
  | "Especialização"
  | "CSBM"
  | "CFSD"
  | "CHC"
  | "CHSGT"
  | "CAS"
  | "CHO"
  | "CFO"
  | "CAO"
  | "Outro";

// Tipos de cursos civis conforme a Lei 5461
export type CursoCivilTipo =
  | "Superior"
  | "Especialização"
  | "Mestrado"
  | "Doutorado";

// Tipos de condecorações conforme a Lei 5461
export type CondecoracaoTipo =
  | "Concedida pelo Governo Federal"
  | "Reconhecido pelo CBMEPI"
  | "Concedida pelo Governo Estadual"
  | "Reconhecido pelo CBMEPI"
  | "Concedida Pelo CBMEPI";

// Tipos de elogios conforme a Lei 5461
export type ElogioTipo = "Individual" | "Coletivo";

// Tipos de punições conforme a Lei 5461
export type PunicaoTipo = "Repreensão" | "Detenção" | "Prisão";

export interface Promocao {
  id: string;
  militarId: string;
  cargo: string;
  dataPromocao: string;
  criterio: CriterioPromocao;
  anexoDocumento: string | null;
}

export interface CursoMilitar {
  id: string;
  militarId: string;
  nome: string;
  tipo: CursoMilitarTipo;
  instituicao: string;
  cargaHoraria: number;
  pontos: number;
  anexo: string | null;
}

export interface CursoCivil {
  id: string;
  militarId: string;
  nome: string;
  tipo: CursoCivilTipo;
  instituicao: string;
  cargaHoraria: number;
  pontos: number;
  anexo: string | null;
}

export interface Condecoracao {
  id: string;
  militarId: string;
  tipo: CondecoracaoTipo;
  descricao: string;
  pontos: number;
  dataRecebimento: string;
  anexo: string | null;
}

export interface Elogio {
  id: string;
  militarId: string;
  tipo: ElogioTipo;
  descricao: string;
  pontos: number;
  dataRecebimento: string;
  anexo: string | null;
}

export interface Punicao {
  id: string;
  militarId: string;
  tipo: PunicaoTipo;
  descricao: string;
  pontos: number;
  dataRecebimento: string;
  anexo: string | null;
}

export interface FaltaAproveitamento {
  id: string;
  militarId: string;
  descricao: string;
  pontos: number;
}

export interface Militar {
  id: string;
  quadro: QuadroMilitar;
  posto: PostoPatente;
  nomeCompleto: string;
  nomeGuerra: string;
  foto: string | null;
  dataNascimento: string;
  dataInclusao: string;
  dataUltimaPromocao: string;
  situacao: SituacaoMilitar;
  email: string;
  tipoSanguineo: TipoSanguineo;
  sexo: Sexo;
}

export interface FichaConceito {
  militarId: string;
  tempoServicoQuadro: number;
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
  faltasAproveitamento: FaltaAproveitamento[];
  totalPontos: number;
}

export interface PontuacaoLei5461 {
  // Valores positivos
  tempoServicoQuadro: { quantidade: number; valor: number; pontosPositivos: number; pontosNegativos: number };
  cursosMilitares: {
    especializacao: { quantidade: number; valor: 2.5; pontosPositivos: number; pontosNegativos: number };
    csbm: { quantidade: number; valor: 4.0; pontosPositivos: number; pontosNegativos: number };
    cfsd: { quantidade: number; valor: 0.5; pontosPositivos: number; pontosNegativos: number };
    chc: { quantidade: number; valor: 0.75; pontosPositivos: number; pontosNegativos: number };
    chsgt: { quantidade: number; valor: 1.0; pontosPositivos: number; pontosNegativos: number };
    cas: { quantidade: number; valor: 1.25; pontosPositivos: number; pontosNegativos: number };
    cho: { quantidade: number; valor: 1.5; pontosPositivos: number; pontosNegativos: number };
    cfo: { quantidade: number; valor: 1.75; pontosPositivos: number; pontosNegativos: number };
    cao: { quantidade: number; valor: 3.0; pontosPositivos: number; pontosNegativos: number };
    csbm2: { quantidade: number; valor: 2.5; pontosPositivos: number; pontosNegativos: number };
  };
  cursosCivis: {
    superior: { quantidade: number; valor: 1.5; pontosPositivos: number; pontosNegativos: number };
    especializacao: { quantidade: number; valor: 2.0; pontosPositivos: number; pontosNegativos: number };
    mestrado: { quantidade: number; valor: 3.0; pontosPositivos: number; pontosNegativos: number };
    doutorado: { quantidade: number; valor: 4.0; pontosPositivos: number; pontosNegativos: number };
  };
  condecoracoes: {
    governoFederal: { quantidade: number; valor: 0.5; pontosPositivos: number; pontosNegativos: number };
    governoEstadual: { quantidade: number; valor: 0.3; pontosPositivos: number; pontosNegativos: number };
    cbmepi: { quantidade: number; valor: 0.2; pontosPositivos: number; pontosNegativos: number };
  };
  elogios: {
    individual: { quantidade: number; valor: 0.15; pontosPositivos: number; pontosNegativos: number };
    coletivo: { quantidade: number; valor: 0.10; pontosPositivos: number; pontosNegativos: number };
  };
  // Valores negativos
  punicoes: {
    repreensao: { quantidade: number; valor: 0.5; pontosPositivos: number; pontosNegativos: number };
    detencao: { quantidade: number; valor: 1.0; pontosPositivos: number; pontosNegativos: number };
    prisao: { quantidade: number; valor: 2.0; pontosPositivos: number; pontosNegativos: number };
  };
  faltaAproveitamentoCursos: { quantidade: number; valor: 5.0; pontosPositivos: number; pontosNegativos: number };
  
  somaTotal: number;
}
