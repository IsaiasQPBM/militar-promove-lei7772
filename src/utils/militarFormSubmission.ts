
import { FormValues } from "@/utils/militarValidation";
import { parse } from "date-fns";
import { createMilitar } from "@/services/militarService";
import { NavigateFunction } from "react-router-dom";
import { QuadroMilitar, SituacaoMilitar, PostoPatente } from "@/types";
import { toast } from "@/components/ui/use-toast";

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
    console.error("Erro na data de nascimento:", error);
    toast({
      title: "Erro no formulário",
      description: "Erro na data de nascimento: Formato inválido. Use DD/MM/AAAA",
      variant: "destructive"
    });
    throw new Error("Erro na data de nascimento: Formato inválido. Use DD/MM/AAAA");
  }
  
  try {
    dataInclusao = parse(values.dataInclusao, "dd/MM/yyyy", new Date());
    if (isNaN(dataInclusao.getTime())) throw new Error("Data de inclusão inválida");
  } catch (error) {
    console.error("Erro na data de inclusão:", error);
    toast({
      title: "Erro no formulário",
      description: "Erro na data de inclusão: Formato inválido. Use DD/MM/AAAA",
      variant: "destructive"
    });
    throw new Error("Erro na data de inclusão: Formato inválido. Use DD/MM/AAAA");
  }
  
  try {
    dataUltimaPromocao = parse(values.dataUltimaPromocao, "dd/MM/yyyy", new Date());
    if (isNaN(dataUltimaPromocao.getTime())) throw new Error("Data de última promoção inválida");
  } catch (error) {
    console.error("Erro na data de última promoção:", error);
    toast({
      title: "Erro no formulário",
      description: "Erro na data de última promoção: Formato inválido. Use DD/MM/AAAA",
      variant: "destructive"
    });
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
  
  try {
    console.log("Preparando dados para enviar ao Supabase...");
    
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
    
    console.log("Dados preparados para envio:", novoMilitar);
    
    // Salvar o militar no banco de dados
    const militarCriado = await createMilitar(novoMilitar);
    console.log("Resposta da criação do militar:", militarCriado);
    
    if (!militarCriado) {
      throw new Error("Não foi possível criar o militar. Resposta vazia do servidor.");
    }
    
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
    
    toast({
      title: "Sucesso!",
      description: `Militar ${values.nomeGuerra} cadastrado com sucesso no quadro ${quadroFinal}`,
    });
    
    return {
      success: true,
      quadro: quadroFinal,
      redirectPath
    };
  } catch (error: any) {
    console.error("Erro ao cadastrar militar no Supabase:", error);
    
    let errorMessage = "Erro desconhecido ao cadastrar militar";
    
    if (error?.message) {
      errorMessage = error.message;
    }
    
    if (error?.code === "23505") {
      errorMessage = "Já existe um militar com esses dados cadastrados";
    } else if (error?.code === "23503") {
      errorMessage = "Erro de referência: um dos campos faz referência a um valor que não existe";
    } else if (error?.code === "42P01") {
      errorMessage = "Tabela 'militares' não encontrada no banco de dados";
    } else if (error?.code === "42703") {
      errorMessage = "Coluna não existe na tabela 'militares'";
    } else if (error?.statusText === "Unauthorized") {
      errorMessage = "Seu acesso expirou ou você não tem permissão para realizar essa operação";
    }
    
    toast({
      title: "Erro ao cadastrar militar",
      description: errorMessage,
      variant: "destructive"
    });
    
    throw new Error(errorMessage);
  }
};
