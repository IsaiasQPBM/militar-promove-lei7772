
import React from "react";
import GestaoPromocoesComponent from "@/components/GestaoPromocoes";

const GestaoPromocoesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestão de Promoções</h1>
      <p className="text-gray-600">
        Acompanhe e gerencie as promoções dos militares conforme a Lei 7.772/2022. 
        Este sistema calcula automaticamente as datas previstas para as próximas promoções 
        com base no tempo mínimo exigido em cada posto/graduação.
      </p>
      
      <GestaoPromocoesComponent />
    </div>
  );
};

export default GestaoPromocoesPage;
