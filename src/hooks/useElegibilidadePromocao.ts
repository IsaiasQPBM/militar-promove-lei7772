
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Militar, PostoPatente } from "@/types";
import { format, parseISO, differenceInMonths } from "date-fns";

interface ElegibilidadeCriterio {
  id: string;
  descricao: string;
  cumprido: boolean;
  observacao?: string;
}

export interface ElegibilidadeData {
  elegivel: boolean;
  parcialmenteElegivel: boolean;
  criteriosCumpridos: number;
  totalCriterios: number;
  criterios: ElegibilidadeCriterio[];
  proximaDataElegivel?: string;
  pontuacaoMinima?: number;
  pontuacaoAtual?: number;
  motivoInelegibilidade?: string;
}

// Tempo mínimo em meses por posto para ser elegível à promoção
const temposMinimosPromoção: Record<PostoPatente, number> = {
  "Coronel": 0, // Posto máximo
  "Tenente-Coronel": 36, // 3 anos em meses
  "Major": 48, // 4 anos em meses
  "Capitão": 48, // 4 anos em meses
  "1º Tenente": 48, // 4 anos em meses
  "2º Tenente": 36, // 3 anos em meses
  "Subtenente": 0, // Graduação máxima para praças
  "1º Sargento": 36, // 3 anos em meses
  "2º Sargento": 48, // 4 anos em meses
  "3º Sargento": 48, // 4 anos em meses
  "Cabo": 36, // 3 anos em meses
  "Soldado": 24, // 2 anos em meses
};

export const useElegibilidadePromocao = (militarId: string | null) => {
  const [elegibilidade, setElegibilidade] = useState<ElegibilidadeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!militarId) return;
    
    const verificarElegibilidade = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Buscar dados do militar
        const { data: militar, error: militarError } = await supabase
          .from("militares")
          .select("*")
          .eq("id", militarId)
          .single();
          
        if (militarError) throw militarError;
        if (!militar) throw new Error("Militar não encontrado");
        
        // 2. Buscar ficha de conceito
        const { data: fichaConceito, error: fichaError } = await supabase
          .from("fichas_conceito")
          .select("*")
          .eq("militar_id", militarId)
          .single();
          
        // A ficha pode não existir ainda, mas isso não é um erro crítico
        
        // Converter dados para o formato necessário
        const posto = militar.posto as PostoPatente;
        const dataUltimaPromocao = militar.dataultimapromocao ? parseISO(militar.dataultimapromocao) : null;
        
        // Critérios de elegibilidade
        const criterios: ElegibilidadeCriterio[] = [];
        
        // Verificar tempo mínimo no posto atual
        const tempoMinimo = temposMinimosPromoção[posto] || 0;
        let tempoNoPosto = 0;
        
        if (dataUltimaPromocao) {
          tempoNoPosto = differenceInMonths(new Date(), dataUltimaPromocao);
        }
        
        criterios.push({
          id: "tempo_posto",
          descricao: `Tempo mínimo no posto atual (${tempoMinimo} meses)`,
          cumprido: tempoNoPosto >= tempoMinimo,
          observacao: tempoNoPosto < tempoMinimo 
            ? `Faltam ${tempoMinimo - tempoNoPosto} meses` 
            : `Tem ${tempoNoPosto} meses no posto atual`
        });
        
        // Verificar se está no posto máximo
        if (posto === "Coronel" || posto === "Subtenente") {
          criterios.push({
            id: "posto_maximo",
            descricao: "Posto/graduação máximo na carreira",
            cumprido: false,
            observacao: "Não há promoção além deste posto/graduação"
          });
        }
        
        // Critério de pontuação (Lei 5461 para oficiais)
        if (["2º Tenente", "1º Tenente", "Capitão", "Major", "Tenente-Coronel"].includes(posto)) {
          // Pontuação mínima varia conforme o posto - valores fictícios, ajuste conforme a legislação real
          const pontuacaoMinima = {
            "2º Tenente": 5,
            "1º Tenente": 7,
            "Capitão": 10,
            "Major": 12,
            "Tenente-Coronel": 15
          }[posto] || 0;
          
          const pontuacaoAtual = fichaConceito?.totalpontos || 0;
          
          criterios.push({
            id: "pontuacao_minima",
            descricao: `Pontuação mínima necessária (${pontuacaoMinima} pontos)`,
            cumprido: pontuacaoAtual >= pontuacaoMinima,
            observacao: pontuacaoAtual < pontuacaoMinima
              ? `Faltam ${pontuacaoMinima - pontuacaoAtual} pontos`
              : `Possui ${pontuacaoAtual} pontos`
          });
        }
        
        // Critério de situação ativa
        criterios.push({
          id: "situacao_ativa",
          descricao: "Situação ativa",
          cumprido: militar.situacao === "ativo",
          observacao: militar.situacao !== "ativo" ? "Militar inativo não é elegível para promoção" : undefined
        });
        
        // Calcular resultado final
        const criteriosCumpridos = criterios.filter(c => c.cumprido).length;
        const totalCriterios = criterios.length;
        
        // Um militar é elegível se cumprir todos os critérios
        const elegivel = criteriosCumpridos === totalCriterios && totalCriterios > 0;
        
        // Um militar é parcialmente elegível se cumprir pelo menos um critério, mas não todos
        const parcialmenteElegivel = criteriosCumpridos > 0 && criteriosCumpridos < totalCriterios;
        
        // Identificar motivo de inelegibilidade
        let motivoInelegibilidade = undefined;
        if (!elegivel && !parcialmenteElegivel) {
          motivoInelegibilidade = "Não cumpre nenhum critério para promoção";
        } else if (!elegivel) {
          const criteriosFaltantes = criterios.filter(c => !c.cumprido).map(c => c.descricao).join("; ");
          motivoInelegibilidade = `Critérios não cumpridos: ${criteriosFaltantes}`;
        }
        
        // Resultado final
        const resultado: ElegibilidadeData = {
          elegivel,
          parcialmenteElegivel,
          criteriosCumpridos,
          totalCriterios,
          criterios,
          pontuacaoMinima: fichaConceito?.totalpontos || 0,
          pontuacaoAtual: fichaConceito?.totalpontos || 0,
          motivoInelegibilidade
        };
        
        setElegibilidade(resultado);
      } catch (err: any) {
        console.error("Erro ao verificar elegibilidade:", err);
        setError(err.message || "Erro ao verificar elegibilidade");
      } finally {
        setLoading(false);
      }
    };
    
    verificarElegibilidade();
  }, [militarId]);
  
  return { elegibilidade, loading, error };
};
