
import { NavigateFunction } from "react-router-dom";
import { FormValues } from "./militarValidation";
import { createMilitar } from "@/services/militarService";
import { QuadroMilitar, PostoPatente, SituacaoMilitar } from "@/types";
import { verificarDisponibilidadeVaga } from "@/services/qfvService";
import { toast } from "@/components/ui/use-toast";

export const submitMilitarForm = async (
  values: FormValues & { foto?: string | null },
  navigate: NavigateFunction
) => {
  // Check if the quadro should be adjusted based on the situation
  let quadro = values.quadro as QuadroMilitar;
  if (values.situacao === "inativo") {
    if (quadro === "QOEM" || quadro === "QOE" || quadro === "QOBM-S" || 
        quadro === "QOBM-E" || quadro === "QOBM-C") {
      quadro = "QORR";
    } else if (quadro === "QPBM") {
      quadro = "QPRR";
    }
  }
  
  // Check vacancy availability for active militares
  if (values.situacao === "ativo") {
    const { disponivel, mensagem } = await verificarDisponibilidadeVaga(
      values.posto as PostoPatente,
      quadro
    );
    
    if (!disponivel) {
      toast({
        title: "No vacancies available",
        description: mensagem,
        variant: "destructive"
      });
      return { success: false, error: mensagem };
    }
  }
  
  try {
    // Create militar in the database
    const militar = await createMilitar({
      nomeCompleto: values.nomeCompleto,
      nomeGuerra: values.nomeGuerra,
      posto: values.posto as PostoPatente,
      quadro: quadro,
      dataNascimento: values.dataNascimento,
      dataInclusao: values.dataInclusao,
      dataUltimaPromocao: values.dataUltimaPromocao,
      situacao: values.situacao as SituacaoMilitar,
      email: values.email,
      foto: values.foto || "",
      tipoSanguineo: values.tipoSanguineo,
      sexo: values.sexo
    });

    // Determine which page to redirect to
    let redirectPath = "/";
    
    if (militar.quadro === "QOEM") {
      redirectPath = "/oficiais/estado-maior";
    } else if (militar.quadro === "QOE") {
      redirectPath = "/oficiais/especialistas";
    } else if (militar.quadro === "QOBM-S") {
      redirectPath = "/oficiais/saude";
    } else if (militar.quadro === "QOBM-E") {
      redirectPath = "/oficiais/engenheiros";
    } else if (militar.quadro === "QOBM-C") {
      redirectPath = "/oficiais/complementares";
    } else if (militar.quadro === "QORR") {
      redirectPath = "/oficiais/reserva";
    } else if (militar.quadro === "QPBM") {
      redirectPath = "/pracas/ativos";
    } else if (militar.quadro === "QPRR") {
      redirectPath = "/pracas/reserva";
    }
    
    return {
      success: true,
      redirectPath,
      militar,
      quadro: militar.quadro
    };
    
  } catch (error: any) {
    console.error("Error registering militar:", error);
    throw error;
  }
};
