
import { ImportarMilitares } from "@/components/fichaMilitar/editarRegistros";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ImportarMilitaresPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Importação de Militares</h1>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
        >
          Voltar
        </Button>
      </div>
      
      <p className="text-gray-500">
        Utilize esta ferramenta para importar dados de militares para o sistema. 
        Você pode selecionar um arquivo de texto (.txt) ou utilizar o exemplo fornecido.
      </p>
      
      <ImportarMilitares />
    </div>
  );
};

export default ImportarMilitaresPage;
