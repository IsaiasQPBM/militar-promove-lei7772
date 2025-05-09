
import React from "react";
import GestaoPromocoesComponent from "@/components/GestaoPromocoes";

const GestaoPromocoesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Análise de Elegibilidade para Promoções</h1>
      <p className="text-gray-600">
        Acompanhe os militares que estão elegíveis para promoção conforme a Lei 7.772/2022. 
        As inclusões no Quadro de Acesso ocorrem em 18 de julho e 23 de dezembro.
      </p>
      <p className="text-gray-600 italic">
        Nota: As promoções são atos oficiais do Comandante Geral em conjunto com o Governador do Estado, 
        conforme legislação vigente. Este sistema fornece apenas análise informativa.
      </p>
      
      <GestaoPromocoesComponent />
    </div>
  );
};

export default GestaoPromocoesPage;
