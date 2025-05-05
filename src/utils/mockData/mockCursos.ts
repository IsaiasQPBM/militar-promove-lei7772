
import { CursoMilitar, CursoCivil } from "@/types";

// Mock cursos militares
export const mockCursosMilitares: CursoMilitar[] = [
  {
    id: "1",
    militar_id: "abc123",
    nome: "Curso de Operações de Resgate",
    tipo: "Especialização",
    instituicao: "Academia de Bombeiros Militar",
    cargahoraria: 120,
    pontos: 2.5
  },
  {
    id: "2",
    militar_id: "abc123",
    nome: "Curso de Combate a Incêndios Florestais",
    tipo: "Especialização",
    instituicao: "Centro de Treinamento de Bombeiros",
    cargahoraria: 80,
    pontos: 1.5
  }
];

// Mock cursos civis
export const mockCursosCivis: CursoCivil[] = [
  {
    id: "1",
    militar_id: "abc123",
    nome: "Engenharia de Segurança do Trabalho",
    tipo: "Superior",
    instituicao: "Universidade Federal",
    cargahoraria: 3600,
    pontos: 1.5
  },
  {
    id: "2",
    militar_id: "abc123",
    nome: "MBA em Gestão de Crises",
    tipo: "Especialização",
    instituicao: "Faculdade de Administração",
    cargahoraria: 420,
    pontos: 2.0
  }
];
