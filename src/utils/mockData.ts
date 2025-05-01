import { 
  Militar, 
  Promocao, 
  CursoMilitar,
  CursoCivil,
  Condecoracao,
  Elogio,
  Punicao 
} from "@/types";

// Mock militares data
export const mockMilitares: Militar[] = [
  {
    id: "1",
    quadro: "QOE",
    posto: "Major",
    nomeCompleto: "José Erisman de Sousa",
    nomeGuerra: "Erisman",
    foto: "https://api.dicebear.com/7.x/initials/svg?seed=Erisman",
    dataNascimento: "1980-05-12",
    dataInclusao: "2000-03-01",
    dataUltimaPromocao: "2022-12-23",
    situacao: "ativo",
    email: "erisman@cbmepi.gov.br",
    tipoSanguineo: "A+",
    sexo: "Masculino"
  },
  {
    id: "2",
    quadro: "QOE",
    posto: "Major",
    nomeCompleto: "Flaubert Rocha Vieira",
    nomeGuerra: "Flaubert",
    foto: "https://api.dicebear.com/7.x/initials/svg?seed=Flaubert",
    dataNascimento: "1982-07-23",
    dataInclusao: "2002-01-15",
    dataUltimaPromocao: "2023-07-18",
    situacao: "ativo",
    email: "flaubert@cbmepi.gov.br",
    tipoSanguineo: "O+",
    sexo: "Masculino"
  },
  {
    id: "3",
    quadro: "QOEM",
    posto: "Coronel",
    nomeCompleto: "Roberto Carlos Sousa",
    nomeGuerra: "Roberto",
    foto: "https://api.dicebear.com/7.x/initials/svg?seed=Roberto",
    dataNascimento: "1975-03-10",
    dataInclusao: "1995-01-10",
    dataUltimaPromocao: "2020-06-15",
    situacao: "ativo",
    email: "roberto@cbmepi.gov.br",
    tipoSanguineo: "B+",
    sexo: "Masculino"
  },
  {
    id: "4",
    quadro: "QORR",
    posto: "Tenente-Coronel",
    nomeCompleto: "Carlos Alberto Pereira",
    nomeGuerra: "Alberto",
    foto: "https://api.dicebear.com/7.x/initials/svg?seed=Alberto",
    dataNascimento: "1968-11-20",
    dataInclusao: "1990-02-22",
    dataUltimaPromocao: "2018-04-10",
    situacao: "inativo",
    email: "alberto@cbmepi.gov.br",
    tipoSanguineo: "AB+",
    sexo: "Masculino"
  },
  {
    id: "5",
    quadro: "QPBM",
    posto: "1º Sargento",
    nomeCompleto: "Ana Maria da Silva",
    nomeGuerra: "Ana",
    foto: "https://api.dicebear.com/7.x/initials/svg?seed=Ana",
    dataNascimento: "1985-09-05",
    dataInclusao: "2005-03-15",
    dataUltimaPromocao: "2021-08-12",
    situacao: "ativo",
    email: "ana@cbmepi.gov.br",
    tipoSanguineo: "A-",
    sexo: "Feminino"
  },
  {
    id: "6",
    quadro: "QPRR",
    posto: "Subtenente",
    nomeCompleto: "João Paulo Ferreira",
    nomeGuerra: "João",
    foto: "https://api.dicebear.com/7.x/initials/svg?seed=João",
    dataNascimento: "1970-02-28",
    dataInclusao: "1990-06-10",
    dataUltimaPromocao: "2015-10-05",
    situacao: "inativo",
    email: "joao@cbmepi.gov.br",
    tipoSanguineo: "O-",
    sexo: "Masculino"
  }
];

// Mock promoções data
export const mockPromocoes: Promocao[] = [
  {
    id: "p1",
    militarId: "1",
    cargo: "Major",
    dataPromocao: "2022-12-23",
    criterio: "Merecimento",
    anexoDocumento: null
  },
  {
    id: "p2",
    militarId: "1",
    cargo: "Capitão",
    dataPromocao: "2018-06-15",
    criterio: "Antiguidade",
    anexoDocumento: null
  },
  {
    id: "p3",
    militarId: "2",
    cargo: "Major",
    dataPromocao: "2023-07-18",
    criterio: "Antiguidade",
    anexoDocumento: null
  },
  {
    id: "p4",
    militarId: "3",
    cargo: "Coronel",
    dataPromocao: "2020-06-15",
    criterio: "Merecimento",
    anexoDocumento: null
  }
];

// Mock cursos militares
export const mockCursosMilitares: CursoMilitar[] = [
  {
    id: "cm1",
    militarId: "1",
    nome: "Curso de Formação de Oficiais",
    instituicao: "Academia de Bombeiros Militar",
    cargaHoraria: 3600,
    pontos: 4.0,
    anexo: null
  },
  {
    id: "cm2",
    militarId: "1",
    nome: "Curso de Aperfeiçoamento de Oficiais",
    instituicao: "Academia de Bombeiros Militar",
    cargaHoraria: 1200,
    pontos: 3.0,
    anexo: null
  }
];

// Mock cursos civis
export const mockCursosCivis: CursoCivil[] = [
  {
    id: "cc1",
    militarId: "1",
    nome: "Direito",
    instituicao: "Universidade Federal do Piauí",
    cargaHoraria: 3600,
    pontos: 3.0,
    anexo: null
  },
  {
    id: "cc2",
    militarId: "1",
    nome: "Especialização em Gestão Pública",
    instituicao: "Universidade Estadual do Piauí",
    cargaHoraria: 480,
    pontos: 2.0,
    anexo: null
  }
];

// Mock condecorações
export const mockCondecoracoes: Condecoracao[] = [
  {
    id: "cond1",
    militarId: "1",
    tipo: "Medalha de Mérito Operacional",
    descricao: "Por serviços prestados em operações especiais",
    pontos: 0.5,
    dataRecebimento: "2021-05-10",
    anexo: null
  }
];

// Mock elogios
export const mockElogios: Elogio[] = [
  {
    id: "e1",
    militarId: "1",
    tipo: "Individual",
    descricao: "Por desempenho excepcional no resgate em desabamento",
    pontos: 0.15,
    dataRecebimento: "2022-08-22",
    anexo: null
  }
];

// Mock punições
export const mockPunicoes: Punicao[] = [];

// Helper function to get militares by quadro
export const getMilitaresByQuadro = (quadro: string): Militar[] => {
  return mockMilitares.filter(m => m.quadro === quadro);
};

// Helper function to get promoções by militar
export const getPromocoesByMilitar = (militarId: string): Promocao[] => {
  return mockPromocoes.filter(p => p.militarId === militarId)
    .sort((a, b) => new Date(b.dataPromocao).getTime() - new Date(a.dataPromocao).getTime());
};

// Helper function to get militar by id
export const getMilitarById = (id: string): Militar | undefined => {
  return mockMilitares.find(m => m.id === id);
};
