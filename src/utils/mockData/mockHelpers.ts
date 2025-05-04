
import { Militar, Promocao } from "@/types";
import { mockMilitares } from "./mockMilitares";
import { mockPromocoes } from "./mockPromocoes";

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
