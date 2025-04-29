
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EditarHeaderProps {
  title: string;
}

const EditarHeader = ({ title }: EditarHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
      >
        Voltar
      </Button>
    </div>
  );
};

export default EditarHeader;
