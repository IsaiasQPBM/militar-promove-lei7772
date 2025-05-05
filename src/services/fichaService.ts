
import { supabase } from "@/integrations/supabase/client";
import { FichaConceito } from "@/types";

export const getFichaConceito = async (militarId: string) => {
  try {
    const { data, error } = await supabase
      .from("fichas_conceito")
      .select("*")
      .eq("militar_id", militarId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar ficha de conceito:', error);
    throw error;
  }
};

export const salvarFichaConceito = async (ficha: {
  militarId: string;
  tempoServicoQuadro?: number;
  totalPontos: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("fichas_conceito")
      .upsert({ 
        militar_id: ficha.militarId, 
        totalpontos: ficha.totalPontos,
        temposervicoquadro: ficha.tempoServicoQuadro
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar ficha de conceito:', error);
    throw error;
  }
};

export const importDataFromPDFExtraction = async (militarId: string, extractedData: any) => {
  try {
    // Processar os dados extraídos do PDF
    console.log("Processando dados extraídos:", extractedData);
    
    // Exemplo de lógica para processar os dados extraídos
    // Aqui você pode salvar em diferentes tabelas conforme o tipo de dado
    
    // Salvar cursos militares
    if (extractedData.cursosMilitares && Array.isArray(extractedData.cursosMilitares)) {
      for (const curso of extractedData.cursosMilitares) {
        await supabase
          .from("cursos_militares")
          .insert({
            militar_id: militarId,
            nome: curso.nome,
            tipo: curso.tipo,
            instituicao: curso.instituicao,
            cargahoraria: curso.cargaHoraria,
            pontos: curso.pontos
          });
      }
    }
    
    // Salvar cursos civis
    if (extractedData.cursosCivis && Array.isArray(extractedData.cursosCivis)) {
      for (const curso of extractedData.cursosCivis) {
        await supabase
          .from("cursos_civis")
          .insert({
            militar_id: militarId,
            nome: curso.nome,
            tipo: curso.tipo,
            instituicao: curso.instituicao,
            cargahoraria: curso.cargaHoraria,
            pontos: curso.pontos
          });
      }
    }
    
    // Salvar condecorações
    if (extractedData.condecoracoes && Array.isArray(extractedData.condecoracoes)) {
      for (const condecoracao of extractedData.condecoracoes) {
        await supabase
          .from("condecoracoes")
          .insert({
            militar_id: militarId,
            tipo: condecoracao.tipo,
            descricao: condecoracao.descricao,
            datarecebimento: condecoracao.dataRecebimento,
            pontos: condecoracao.pontos
          });
      }
    }
    
    // Atualizar ficha de conceito, se houver pontuação
    if (extractedData.pontosTotal !== undefined) {
      await salvarFichaConceito({
        militarId,
        totalPontos: extractedData.pontosTotal
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao importar dados do PDF:", error);
    throw error;
  }
};
