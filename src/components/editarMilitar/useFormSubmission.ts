import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormValues } from "@/utils/militarValidation";
import { updateMilitar } from "@/services/militarService";
import { verificarDisponibilidadeVaga } from "@/services/qfvService";
import { PostoPatente, QuadroMilitar, SituacaoMilitar, Sexo } from "@/types";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

export const useFormSubmission = (militarId: string, militarData: FormValues | null) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    photoPreview, 
    photoFile, 
    setPhotoPreview, 
    setPhotoFile, 
    uploadPhoto 
  } = usePhotoUpload(militarData?.foto || null);

  const handlePhotoChange = (file: File | null) => {
    if (!file) return;
    
    setPhotoFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    if (!militarId) return;
    
    try {
      setIsSubmitting(true);
      
      // Upload photo if changed
      const photoUrl = await uploadPhoto();
      
      // Verificar se a situação deve alterar o quadro
      let quadroFinal = values.quadro as QuadroMilitar;
      if (values.situacao === "inativo") {
        if (quadroFinal === "QOEM" || quadroFinal === "QOE") {
          quadroFinal = "QORR";
        } else if (quadroFinal === "QOBM-S" || quadroFinal === "QOBM-E" || quadroFinal === "QOBM-C") {
          quadroFinal = "QORR";
        } else if (quadroFinal === "QPBM") {
          quadroFinal = "QPRR";
        }
      }
      
      // Verificar se a situação está mudando para ativo
      if (values.situacao === "ativo" && 
          (militarData?.situacao !== values.situacao)) {
        
        // Verificar se tem vagas disponíveis
        const { disponivel, mensagem } = await verificarDisponibilidadeVaga(
          values.posto as PostoPatente, 
          quadroFinal
        );
        
        if (!disponivel) {
          toast({
            title: "Sem vagas disponíveis",
            description: mensagem,
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Atualizar o militar no banco de dados
      await updateMilitar(militarId, {
        nome: values.nomeCompleto,
        nomeCompleto: values.nomeCompleto,
        nomeGuerra: values.nomeGuerra,
        quadro: quadroFinal,
        posto: values.posto as PostoPatente,
        dataNascimento: values.dataNascimento,
        dataInclusao: values.dataInclusao,
        dataUltimaPromocao: values.dataUltimaPromocao,
        situacao: values.situacao as SituacaoMilitar,
        email: values.email,
        foto: photoUrl,
        tipoSanguineo: values.tipoSanguineo,
        sexo: values.sexo
      });
      
      toast({
        title: "Militar atualizado com sucesso!",
        description: `Os dados de ${values.nomeCompleto} foram atualizados.`
      });
      
      // Determinar para qual página redirecionar
      let redirectPath = "/";
      
      if (quadroFinal === "QOEM") {
        redirectPath = "/oficiais/estado-maior";
      } else if (quadroFinal === "QOE") {
        redirectPath = "/oficiais/especialistas";
      } else if (quadroFinal === "QOBM-S") {
        redirectPath = "/oficiais/saude";
      } else if (quadroFinal === "QOBM-E") {
        redirectPath = "/oficiais/engenheiros";
      } else if (quadroFinal === "QOBM-C") {
        redirectPath = "/oficiais/complementares";
      } else if (quadroFinal === "QORR") {
        redirectPath = "/oficiais/reserva";
      } else if (quadroFinal === "QPBM") {
        redirectPath = "/pracas/ativos";
      } else if (quadroFinal === "QPRR") {
        redirectPath = "/pracas/reserva";
      }
      
      navigate(redirectPath);
      
    } catch (error) {
      console.error("Erro ao atualizar militar:", error);
      toast({
        title: "Erro ao atualizar militar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    photoPreview,
    handlePhotoChange,
    onSubmit,
    isSubmitting
  };
};
