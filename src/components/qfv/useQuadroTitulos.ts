
// Helper hook to get quadro titles
export const useQuadroTitulos = () => {
  // Mapeia os quadros para seus títulos completos
  const quadroTitulos: Record<string, string> = {
    "QOEM": "Quadro de Oficiais Bombeiros Militar Combatentes (QOEM)",
    "QOE": "Quadro de Oficiais Especialistas (QOE)",
    "QOBM-S": "Quadro de Oficiais Bombeiros Militar de Saúde (QOBM-S)",
    "QOBM-E": "Quadro de Oficiais Bombeiros Militar Engenheiros (QOBM-E)",
    "QOBM-C": "Quadro de Oficiais Bombeiros Militar Complementares (QOBM-C)",
    "QORR": "Quadro de Oficiais da Reserva Remunerada (QORR)",
    "QPBM": "Quadro de Praças Bombeiros Militares (QPBM)",
    "QPRR": "Quadro de Praças da Reserva Remunerada (QPRR)"
  };
  
  return quadroTitulos;
};
