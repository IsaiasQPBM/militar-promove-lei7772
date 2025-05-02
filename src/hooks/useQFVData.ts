
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { QuadroMilitar } from "@/types";
import { QFVData, QFVDataByQuadro } from "@/types/qfv";

// Dados da Lei nº 7.772/2022
export const vagasLeiData = {
  // I – QUADRO DE OFICIAIS BOMBEIROS MILITAR COMBATENTES
  QOEM: {
    "Coronel": 6,
    "Tenente-Coronel": 16,
    "Major": 35,
    "Capitão": 38,
    "1º Tenente": 50,
    "2º Tenente": 56
  },
  // II – QUADRO DE OFICIAIS BOMBEIROS MILITAR DE SAÚDE
  "QOBM-S": {
    "Coronel": 0,
    "Tenente-Coronel": 1,
    "Major": 1,
    "Capitão": 2,
    "1º Tenente": 2,
    "2º Tenente": 6
  },
  // III – QUADRO DE OFICIAIS BOMBEIROS MILITAR ENGENHEIROS
  "QOBM-E": {
    "Coronel": 0,
    "Tenente-Coronel": 2,
    "Major": 2,
    "Capitão": 2,
    "1º Tenente": 2,
    "2º Tenente": 2
  },
  // IV- QUADRO DE OFICIAIS BOMBEIROS MILITAR COMPLEMENTARES
  "QOBM-C": {
    "Coronel": 0,
    "Tenente-Coronel": 0,
    "Major": 6,
    "Capitão": 24,
    "1º Tenente": 36,
    "2º Tenente": 41
  },
  // QOE - Mantendo para compatibilidade com dados existentes
  QOE: {
    "Coronel": 0,
    "Tenente-Coronel": 1,
    "Major": 2,
    "Capitão": 3,
    "1º Tenente": 5,
    "2º Tenente": 8
  },
  // V – QUADRO DE PRAÇAS BOMBEIROS MILITAR
  QPBM: {
    "Subtenente": 63,
    "1º Sargento": 102,
    "2º Sargento": 130,
    "3º Sargento": 150,
    "Cabo": 240,
    "Soldado": 428
  },
  QORR: {},
  QPRR: {}
};

export const useQFVData = () => {
  const [qfvData, setQFVData] = useState<QFVDataByQuadro>({
    QOEM: [],
    QOE: [],
    "QOBM-S": [],
    "QOBM-E": [],
    "QOBM-C": [],
    QORR: [],
    QPBM: [],
    QPRR: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      
      try {
        // Buscar todos os militares ativos
        const { data: militares, error } = await supabase
          .from("militares")
          .select("posto, quadro, situacao")
          .eq("situacao", "ativo");
          
        if (error) throw error;
        
        // Contar militares por posto e quadro
        const contagem: Record<string, Record<string, number>> = {
          QOEM: {},
          QOE: {},
          "QOBM-S": {},
          "QOBM-E": {},
          "QOBM-C": {},
          QORR: {},
          QPBM: {},
          QPRR: {}
        };
        
        militares.forEach(militar => {
          const { posto, quadro } = militar;
          if (posto && quadro) {
            if (!contagem[quadro]) {
              contagem[quadro] = {};
            }
            
            if (!contagem[quadro][posto]) {
              contagem[quadro][posto] = 0;
            }
            
            contagem[quadro][posto]++;
          }
        });
        
        // Calcular vagas disponíveis por quadro e posto
        const dadosQFV: QFVDataByQuadro = {
          QOEM: [],
          QOE: [],
          "QOBM-S": [],
          "QOBM-E": [],
          "QOBM-C": [],
          QORR: [],
          QPBM: [],
          QPRR: []
        };
        
        // Processar cada quadro
        Object.keys(vagasLeiData).forEach(quadro => {
          if (quadro === "QORR" || quadro === "QPRR") {
            // Para os quadros de reserva, mostrar apenas a contagem
            const postosQuadro = Object.keys(contagem[quadro] || {});
            postosQuadro.forEach(posto => {
              const vagasOcupadas = contagem[quadro][posto] || 0;
              
              dadosQFV[quadro].push({
                posto,
                vagasLei: 0, // Sem limite na reserva
                vagasOcupadas,
                vagasDisponiveis: 0
              });
            });
          } else {
            // Para os quadros ativos, mostrar vagas da lei, ocupadas e disponíveis
            Object.keys(vagasLeiData[quadro]).forEach(posto => {
              const vagasLeiPosto = vagasLeiData[quadro][posto] || 0;
              const vagasOcupadas = contagem[quadro]?.[posto] || 0;
              
              dadosQFV[quadro].push({
                posto,
                vagasLei: vagasLeiPosto,
                vagasOcupadas,
                vagasDisponiveis: Math.max(0, vagasLeiPosto - vagasOcupadas)
              });
            });
          }
        });
        
        setQFVData(dadosQFV);
        
      } catch (error) {
        console.error("Erro ao carregar dados do QFV:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do Quadro de Fixação de Vagas.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);

  return {
    qfvData,
    loading
  };
};
