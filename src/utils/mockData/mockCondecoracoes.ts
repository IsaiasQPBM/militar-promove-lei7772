
import { Condecoracao } from "@/types";

// Mock condecorações
export const mockCondecoracoes: Condecoracao[] = [
  {
    id: "1",
    militarId: "abc123",
    tipo: "Concedida pelo Governo Federal",
    descricao: "Medalha de Mérito por salvamento em incêndio",
    dataRecebimento: "10/05/2022",
    pontos: 0.5,
    anexo: null
  },
  {
    id: "2",
    militarId: "abc123",
    tipo: "Concedida Pelo CBMEPI",
    descricao: "Honra ao Mérito por tempo de serviço",
    dataRecebimento: "15/08/2023",
    pontos: 0.2,
    anexo: null
  }
];
