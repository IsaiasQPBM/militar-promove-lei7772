
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileEdit, ListChecks, History } from "lucide-react";

interface AcoesNavegacaoProps {
  id: string;
}

export const AcoesNavegacao = ({ id }: AcoesNavegacaoProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => navigate(`/editar-militar/${id}`)}
      >
        <FileEdit className="h-4 w-4" />
        <span>Editar Dados</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => navigate(`/ficha-conceito/${id}`)}
      >
        <ListChecks className="h-4 w-4" />
        <span>Ficha de Conceito</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => navigate(`/historico-promocoes/${id}`)}
      >
        <History className="h-4 w-4" />
        <span>Histórico de Promoções</span>
      </Button>
    </div>
  );
};
