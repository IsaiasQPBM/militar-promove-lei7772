
import { supabase } from "@/integrations/supabase/client";
import { Promocao } from "@/types";
import { format, addDays, isAfter, isBefore } from "date-fns";

export const getPromocoesByMilitar = async (militarId: string) => {
  const { data, error } = await supabase
    .from("promocoes")
    .select("*")
    .eq("militar_id", militarId)
    .order("data_promocao", { ascending: false });

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    militarId: item.militar_id,
    criterio: item.tipo_promocao || "Antiguidade",
    dataPromocao: item.data_promocao,
    publicada: item.publicada,
    cargo: item.cargo,
    anexoDocumento: item.anexo_documento
  }));
};

// Função para verificar se o militar está no período de inclusão no quadro de acesso
export const verificarPeriodoQuadroAcesso = () => {
  const hoje = new Date();
  
  // Preparar datas das inclusões no quadro de acesso (18 de julho e 23 de dezembro)
  const ano = hoje.getFullYear();
  const dataJulho = new Date(ano, 6, 18); // 18 de julho
  const dataDezembro = new Date(ano, 11, 23); // 23 de dezembro
  
  // Considera um período de 15 dias antes para a inclusão no quadro de acesso
  const inicioJulho = addDays(dataJulho, -15);
  const inicioDezembro = addDays(dataDezembro, -15);
  
  // Verifica se hoje está dentro dos períodos de inclusão
  if (
    (isAfter(hoje, inicioJulho) && isBefore(hoje, dataJulho)) ||
    (isAfter(hoje, inicioDezembro) && isBefore(hoje, dataDezembro))
  ) {
    return true;
  }
  
  return false;
};

// Função para calcular a data mais próxima de inclusão no quadro de acesso
export const calcularProximaDataQuadroAcesso = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  
  // Datas de inclusão no quadro de acesso
  const dataJulho = new Date(ano, 6, 18); // 18 de julho (mês é 0-indexed)
  const dataDezembro = new Date(ano, 11, 23); // 23 de dezembro
  
  // Se já passamos de 23 de dezembro, a próxima data será 18 de julho do próximo ano
  if (isAfter(hoje, dataDezembro)) {
    return new Date(ano + 1, 6, 18);
  }
  
  // Se já passamos de 18 de julho, a próxima data será 23 de dezembro
  if (isAfter(hoje, dataJulho)) {
    return dataDezembro;
  }
  
  // Caso contrário, a próxima data será 18 de julho
  return dataJulho;
};

// Função para obter todos os critérios de promoção baseados no posto atual
export const getCriteriosPromocao = (posto: string, quadro: string) => {
  // Critérios para Oficiais (Lei 7.774/2022)
  if (["Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente"].includes(posto)) {
    return [
      "Estar no posto atual pelo tempo mínimo exigido por lei (Art. 13, §1º)",
      "Para Aspirante a Oficial: 6 meses para 2º Tenente",
      "Para 2º Tenente: 3 anos para 1º Tenente",
      "Para 1º Tenente: 4 anos para Capitão",
      "Para Capitão: 4 anos para Major",
      "Para Major: 4 anos para Tenente-Coronel",
      "Para Tenente-Coronel: 3 anos para Coronel",
      "Possuir aptidão física comprovada em inspeção de saúde (Art. 13, §5º)",
      "Ter conceito profissional e moral favoráveis",
      "Ter sido aprovado no curso correspondente (Art. 13, §1º, II)",
      "Para oficiais subalternos e intermediários: Curso de Formação de Oficial BM",
      "Para oficiais superiores: Curso de Aperfeiçoamento de Oficial BM",
      "Constar no Quadro de Acesso correspondente (Art. 11)",
      "As promoções acontecem em 18 de julho e 23 de dezembro (Art. 15)",
      "Oficiais subalternos e intermediários: promoção por antiguidade (Art. 9º, I)",
      "Major e Tenente-Coronel: alternadamente por antiguidade e merecimento (Art. 9º, II e III)",
      "Coronel: alternadamente por antiguidade e merecimento (Art. 9º, IV)"
    ];
  } 
  // Critérios para Praças (Lei 7.774/2022)
  else {
    return [
      "Estar na graduação atual pelo tempo mínimo exigido por lei",
      "Para Subtenentes: 2 anos para 2º Tenente (QOC)",
      "Para 1º Sargento: 3 anos para Subtenente",
      "Para 2º Sargento: 4 anos para 1º Sargento",
      "Para 3º Sargento: 4 anos para 2º Sargento",
      "Para Cabo: 3 anos para 3º Sargento",
      "Para Soldado: 2 anos para Cabo",
      "Possuir aptidão física comprovada em inspeção de saúde",
      "Estar classificado no comportamento excepcional",
      "Ter conceito profissional e moral favoráveis",
      "Ter sido aprovado no curso exigido para a graduação",
      "Para 1º Sargentos e Subtenentes, constar no Quadro de Acesso por Merecimento (QAM)",
      "Para demais graduações, prevalece a promoção por antiguidade",
      "As promoções acontecem em 18 de julho e 23 de dezembro"
    ];
  }
};

// Implementação dos requisitos da Lei 5.461 para a Ficha de Conceito
export const obterCriteriosLei5461 = () => {
  return {
    tempoDeServico: {
      descricao: "Tempo de serviço no quadro",
      pontuacao: 0.1, // 0.1 ponto por mês
      maximo: null, // Sem limite máximo
    },
    cursosMilitares: {
      especializacao: { pontuacao: 0.5, maximo: 2.0 },
      csbm: { pontuacao: 4.0, maximo: 4.0 },
      cfsd: { pontuacao: 3.0, maximo: 3.0 },
      chc: { pontuacao: 1.0, maximo: 1.0 },
      chsgt: { pontuacao: 1.5, maximo: 1.5 },
      cas: { pontuacao: 2.0, maximo: 2.0 },
      cho: { pontuacao: 2.5, maximo: 2.5 },
      cfo: { pontuacao: 4.0, maximo: 4.0 },
      cao: { pontuacao: 3.0, maximo: 3.0 },
      csbm2: { pontuacao: 3.0, maximo: 3.0 },
    },
    cursosCivis: {
      superior: { pontuacao: 1.0, maximo: 1.0 },
      especializacao: { pontuacao: 1.0, maximo: 3.0 },
      mestrado: { pontuacao: 2.0, maximo: 2.0 },
      doutorado: { pontuacao: 3.0, maximo: 3.0 },
    },
    condecoracoes: {
      governoFederal: { pontuacao: 1.0, maximo: null },
      governoEstadual: { pontuacao: 0.5, maximo: null },
      cbmepi: { pontuacao: 0.2, maximo: null },
    },
    elogios: {
      individual: { pontuacao: 0.2, maximo: null },
      coletivo: { pontuacao: 0.1, maximo: null },
    },
    punicoes: {
      repreensao: { pontuacao: -0.5, maximo: null },
      detencao: { pontuacao: -1.0, maximo: null },
      prisao: { pontuacao: -1.5, maximo: null },
    },
    faltaAproveitamentoCursos: { pontuacao: -1.0, maximo: null },
  };
};
