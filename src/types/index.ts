
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type QuadroMilitar = 
  | "QOEM" // Estado-Maior
  | "QOE"  // Especialistas
  | "QORR" // Reserva Remunerada para Oficiais
  | "QPBM" // Praças
  | "QPRR" // Reserva Remunerada para Praças
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
  instituicao: string;
  cargaHoraria: number;
  pontos: number;
  anexo: string | null;
}

export interface CursoCivil {
  id: string;
  militarId: string;
  nome: string;
  instituicao: string;
  cargaHoraria: number;
  pontos: number;
  anexo: string | null;
}

export interface Condecoracao {
  id: string;
  militarId: string;
  tipo: string;
  descricao: string;
  pontos: number;
  dataRecebimento: string;
  anexo: string | null;
}

export interface Elogio {
  id: string;
  militarId: string;
  tipo: "Individual" | "Coletivo";
  descricao: string;
  pontos: number;
  dataRecebimento: string;
  anexo: string | null;
}

export interface Punicao {
  id: string;
  militarId: string;
  tipo: "Repreensão" | "Detenção" | "Prisão";
  descricao: string;
  pontos: number;
  dataRecebimento: string;
  anexo: string | null;
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
  totalPontos: number;
}
