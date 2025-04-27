
import { FormValues } from "@/utils/militarValidation";
import { parse } from "date-fns";
import { createMilitar } from "@/services/militarService";
import { NavigateFunction } from "react-router-dom";
import { QuadroMilitar, SituacaoMilitar, PostoPatente } from "@/types";

interface SubmitMilitarResult {
  success: boolean;
  quadro: string;
  redirectPath: string;
  error?: string;
}

export const submitMilitarForm = async (
  values: FormValues,
  navigate: NavigateFunction
): Promise<SubmitMilitarResult> => {
  // Validar e converter datas
  let dataNascimento: Date;
  let dataInclusao: Date;
  let dataUltimaPromocao: Date;
  
  try {
    dataNascimento = parse(values.dataNascimento, "dd/MM/yyyy", new Date());
    if (isNaN(dataNascimento.getTime())) throw new Error("Data de nascimento inválida");
  } catch (error) {
    throw new Error("Erro na data de nascimento: Formato inválido. Use DD/MM/AAAA");
  }
  
  try {
    dataInclusao = parse(values.dataInclusao, "dd/MM/yyyy", new Date());
    if (isNaN(dataInclusao.getTime())) throw new Error("Data de inclusão inválida");
  } catch (error) {
    throw new Error("Erro na data de inclusão: Formato inválido. Use DD/MM/AAAA");
  }
  
  try {
    dataUltimaPromocao = parse(values.dataUltimaPromocao, "dd/MM/yyyy", new Date());
    if (isNaN(dataUltimaPromocao.getTime())) throw new Error("Data de última promoção inválida");
  } catch (error) {
    throw new Error("Erro na data de última promoção: Formato inválido. Use DD/MM/AAAA");
  }
  
  // Ajustar quadro com base na situação
  let quadroFinal = values.quadro as QuadroMilitar;
  if (values.situacao === "inativo") {
    if (quadroFinal === "QOEM" || quadroFinal === "QOE") {
      quadroFinal = "QORR";
    } else if (quadroFinal === "QPBM") {
      quadroFinal = "QPRR";
    }
  }
  
  // Preparar objeto para salvar no banco de dados
  const novoMilitar = {
    nomeCompleto: values.nomeCompleto,
    nomeGuerra: values.nomeGuerra,
    foto: `https://api.dicebear.com/7.x/initials/svg?seed=${values.nomeGuerra}`,
    dataNascimento: dataNascimento.toISOString(),
    dataInclusao: dataInclusao.toISOString(),
    dataUltimaPromocao: dataUltimaPromocao.toISOString(),
    posto: values.posto as PostoPatente,
    quadro: quadroFinal,
    situacao: values.situacao as SituacaoMilitar,
    email: values.email
  };
  
  // Salvar o militar no banco de dados
  await createMilitar(novoMilitar);
  
  // Determinar para qual página redirecionar
  let redirectPath = "/";
  
  if (quadroFinal === "QOEM") {
    redirectPath = "/oficiais/estado-maior";
  } else if (quadroFinal === "QOE") {
    redirectPath = "/oficiais/especialistas";
  } else if (quadroFinal === "QORR") {
    redirectPath = "/oficiais/reserva";
  } else if (quadroFinal === "QPBM") {
    redirectPath = "/pracas/ativos";
  } else if (quadroFinal === "QPRR") {
    redirectPath = "/pracas/reserva";
  }
  
  return {
    success: true,
    quadro: quadroFinal,
    redirectPath
  };
};
