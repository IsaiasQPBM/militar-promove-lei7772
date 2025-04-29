
import { useParams } from "react-router-dom";
import EditarHeader from "@/components/editarMilitar/EditarHeader";
import MilitarCard from "@/components/editarMilitar/MilitarCard";
import MilitarForm from "@/components/editarMilitar/MilitarForm";
import { useMilitarData } from "@/components/editarMilitar/useMilitarData";

const EditarMilitar = () => {
  const { id } = useParams();
  const { isLoading, formData } = useMilitarData(id);

  return (
    <div className="space-y-6">
      <EditarHeader title="Editar Militar" />
      
      <MilitarCard>
        <MilitarForm 
          militarData={formData} 
          militarId={id || ""} 
          isLoading={isLoading} 
        />
      </MilitarCard>
    </div>
  );
};

export default EditarMilitar;
