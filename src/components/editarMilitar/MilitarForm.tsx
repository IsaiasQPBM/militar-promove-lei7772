
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { formSchema, FormValues } from "@/utils/militarValidation";
import FormNavigation from "@/components/military/FormNavigation";
import PhotoUpload from "@/components/militar/PhotoUpload";
import FormTabs from "@/components/militar/FormTabs";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useFormSubmission } from "./useFormSubmission";

interface MilitarFormProps {
  militarData: FormValues | null;
  militarId: string;
  isLoading: boolean;
}

const MilitarForm = ({ militarData, militarId, isLoading }: MilitarFormProps) => {
  const navigate = useNavigate();
  const tabs = ["dados-pessoais", "datas", "situacao-contato"];
  const { activeTab, setActiveTab, handleNext, handlePrevious, isFirstTab, isLastTab } = 
    useTabNavigation('dados-pessoais', tabs);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quadro: "",
      posto: "",
      nomeCompleto: "",
      nomeGuerra: "",
      dataNascimento: "",
      dataInclusao: "",
      dataUltimaPromocao: "",
      situacao: "ativo",
      email: "",
      tipoSanguineo: "O+",
      sexo: "Masculino"
    }
  });

  const { photoPreview, handlePhotoChange, onSubmit, isSubmitting } = useFormSubmission(militarId, militarData);

  useEffect(() => {
    if (militarData) {
      form.reset(militarData);
    }
  }, [militarData, form]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do militar...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload Section */}
        <PhotoUpload 
          photoPreview={photoPreview} 
          onChange={handlePhotoChange}
          initialName={militarData?.nomeGuerra}
        />
        
        <FormTabs 
          form={form} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <FormNavigation 
          activeTab={activeTab}
          isLastTab={isLastTab}
          isFirstTab={isFirstTab}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onCancel={() => navigate(-1)}
        />
      </form>
    </Form>
  );
};

export default MilitarForm;
