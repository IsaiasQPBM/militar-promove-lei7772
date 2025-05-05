export interface FichaConceito {
  id: string;
  militar_id: string;
  totalpontos: number;
}

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

export interface PontuacaoLei5461 {
  tempoServicoQuadro: {
    quantidade: number;
    valor: number;
    pontosPositivos: number;
  };
  cursosMilitares: {
    especializacao: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    csbm: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    cfsd: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    chc: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    chsgt: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    cas: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    cho: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    cfo: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    cao: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    csbm2: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
  };
  cursosCivis: {
    superior: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    especializacao: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    mestrado: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    doutorado: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
  };
  condecoracoes: {
    governoFederal: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    governoEstadual: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    cbmepi: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
  };
  elogios: {
    individual: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
    coletivo: {
      quantidade: number;
      valor: number;
      pontosPositivos: number;
    };
  };
  punicoes: {
    repreensao: {
      quantidade: number;
      valor: number;
      pontosNegativos: number;
    };
    detencao: {
      quantidade: number;
      valor: number;
      pontosNegativos: number;
    };
    prisao: {
      quantidade: number;
      valor: number;
      pontosNegativos: number;
    };
  };
  faltaAproveitamentoCursos: {
    quantidade: number;
    valor: number;
    pontosNegativos: number;
  };
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

export type QuadroMilitar = "QOEM" | "QOE" | "QORR" | "QPBM" | "QPRR";

export type CriterioPromocao = "Antiguidade" | "Merecimento" | "Posto máximo" | "Graduação máxima";

export interface Militar {
  id: string;
  nome: string;
  nomeCompleto: string;
  nomeGuerra: string;
  posto: PostoPatente;
  quadro: QuadroMilitar;
  dataNascimento: string;
  dataInclusao: string;
  dataUltimaPromocao: string;
  situacao: "ativo" | "inativo";
  tipoSanguineo: string;
  email?: string;
  foto?: string;
  sexo: "M" | "F";
  unidade?: string;
}

export interface Promocao {
  id: string;
  militarId: string;
  criterio: CriterioPromocao;
  dataPromocao: string;
  publicada?: boolean;
}
