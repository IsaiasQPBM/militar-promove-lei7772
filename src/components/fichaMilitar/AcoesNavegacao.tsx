
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AcoesNavegacaoProps {
  id: string;
}

export const AcoesNavegacao = ({ id }: AcoesNavegacaoProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => navigate(`/militar/${id}/editar`)}
        variant="outline"
      >
        Editar Dados
      </Button>
      <Button
        onClick={() => navigate(`/militar/${id}/promocoes`)}
        variant="outline"
      >
        Histórico de Promoções
      </Button>
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
      >
        Voltar
      </Button>
    </div>
  );
};
