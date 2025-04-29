
import { NavigateFunction } from "react-router-dom";
import { FormValues } from "./militarValidation";
import { createMilitar } from "@/services/militarService";
import { QuadroMilitar, PostoPatente, SituacaoMilitar } from "@/types";

export const submitMilitarForm = async (
  values: FormValues,
  navigate: NavigateFunction
) => {
  // Verificar se o quadro deve ser ajustado com base na situação
  let quadro = values.quadro as QuadroMilitar;
  if (values.situacao === "inativo") {
    if (quadro === "QOEM" || quadro === "QOE") {
      quadro = "QORR";
    } else if (quadro === "QPBM") {
      quadro = "QPRR";
    }
  }
  
  try {
    // Criar militar no banco de dados
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
      foto: ""
    });

    // Determinar para qual página redirecionar
    let redirectPath = "/";
    
    if (militar.quadro === "QOEM") {
      redirectPath = "/oficiais/estado-maior";
    } else if (militar.quadro === "QOE") {
      redirectPath = "/oficiais/especialistas";
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
    console.error("Erro ao cadastrar militar:", error);
    throw error;
  }
};
