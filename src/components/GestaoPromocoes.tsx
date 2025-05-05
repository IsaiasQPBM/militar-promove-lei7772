
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Award } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Militar, CriterioPromocao } from "@/types";
import { calcularPrevisaoIndividual, PrevisaoPromocao } from "@/utils/promocaoUtils";
import TabelaPromocoes from "./TabelaPromocoes";
import { supabase } from "@/integrations/supabase/client";
import { createPromocao } from "@/services/promocaoService";

const GestaoPromocoes: React.FC = () => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoPromocao[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        // Buscar militares reais do banco de dados
        const { data: militaresData, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo");
        
        if (error) throw error;
        
        if (militaresData && militaresData.length > 0) {
          const militaresFormatados: Militar[] = militaresData.map(m => ({
            id: m.id,
            nome: m.nome,
            nomeGuerra: m.nomeguerra || m.nome,
            nomeCompleto: m.nome,
            posto: m.posto,
            quadro: m.quadro,
            dataUltimaPromocao: m.dataultimapromocao,
            dataInclusao: m.data_ingresso,
            dataNascimento: m.datanascimento,
            tipoSanguineo: m.tipo_sanguineo || "Não informado",
            situacao: m.situacao,
            email: m.email,
            foto: m.foto,
            sexo: m.sexo,
            unidade: m.unidade
          }));
          
          setMilitares(militaresFormatados);
          calcularPrevisaoPromocoes(militaresFormatados);
        } else {
          toast({
            title: "Sem militares cadastrados",
            description: "Nenhum militar ativo encontrado no sistema.",
            variant: "default"
          });
          setPrevisoes([]);
        }
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitares();
  }, []);
  
  const calcularPrevisaoPromocoes = (militares: Militar[]) => {
    const previsoes: PrevisaoPromocao[] = militares
      .map(militar => calcularPrevisaoIndividual(militar))
      .filter(p => p.proximoPosto !== null)
      .sort((a, b) => {
        if (!a.dataProximaPromocao || !b.dataProximaPromocao) return 0;
        return a.dataProximaPromocao.getTime() - b.dataProximaPromocao.getTime();
      });
    
    setPrevisoes(previsoes);
  };
  
  const handlePromover = async (previsao: PrevisaoPromocao) => {
    if (!previsao.proximoPosto) return;
    
    try {
      // Criar registro de promoção no banco de dados
      await createPromocao({
        militarId: previsao.militarId,
        criterio: previsao.criterio as CriterioPromocao,
        dataPromocao: new Date().toISOString()
      });
      
      // Atualizar o militar no banco de dados
      const { error } = await supabase
        .from("militares")
        .update({
          posto: previsao.proximoPosto,
          dataultimapromocao: new Date().toISOString()
        })
        .eq("id", previsao.militarId);
      
      if (error) throw error;
      
      // Atualizar o estado local
      setMilitares(prevMilitares => {
        const newMilitares = prevMilitares.map(militar => {
          if (militar.id === previsao.militarId && previsao.proximoPosto) {
            return {
              ...militar,
              posto: previsao.proximoPosto,
              dataUltimaPromocao: new Date().toISOString()
            };
          }
          return militar;
        });
        
        // Recalcular promoções com dados atualizados
        calcularPrevisaoPromocoes(newMilitares);
        return newMilitares;
      });
      
      toast({
        title: "Promoção realizada",
        description: `${previsao.nome} foi promovido para ${previsao.proximoPosto}!`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Erro ao promover militar:", error);
      toast({
        title: "Erro na promoção",
        description: "Não foi possível realizar a promoção. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Gestão de Promoções
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="text-center py-8">Carregando previsões de promoções...</div>
        ) : previsoes.length === 0 ? (
          <div className="text-center py-8">Nenhuma previsão de promoção encontrada</div>
        ) : (
          <TabelaPromocoes 
            previsoes={previsoes} 
            onPromover={handlePromover}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GestaoPromocoes;
