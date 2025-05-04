
import { CursoMilitar, CursoCivil } from "@/types";

// Mock cursos militares
export const mockCursosMilitares: CursoMilitar[] = [
  {
    id: "1",
    militarId: "abc123",
    nome: "Curso de Operações de Resgate",
    tipo: "Especialização",
    instituicao: "Academia de Bombeiros Militar",
    cargaHoraria: 120,
    pontos: 2.5,
    anexo: null
  },
  {
    id: "2",
    militarId: "abc123",
    nome: "Curso de Combate a Incêndios Florestais",
    tipo: "Especialização",
    instituicao: "Centro de Treinamento de Bombeiros",
    cargaHoraria: 80,
    pontos: 1.5,
    anexo: null
  }
];

// Mock cursos civis
export const mockCursosCivis: CursoCivil[] = [
  {
    id: "1",
    militarId: "abc123",
    nome: "Engenharia de Segurança do Trabalho",
    tipo: "Superior",
    instituicao: "Universidade Federal",
    cargaHoraria: 3600,
    pontos: 1.5,
    anexo: null
  },
  {
    id: "2",
    militarId: "abc123",
    nome: "MBA em Gestão de Crises",
    tipo: "Especialização",
    instituicao: "Faculdade de Administração",
    cargaHoraria: 420,
    pontos: 2.0,
    anexo: null
  }
];
