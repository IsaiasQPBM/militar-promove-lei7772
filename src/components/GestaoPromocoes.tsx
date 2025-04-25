
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Award } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Militar } from "@/types";
import { mockMilitares } from "@/utils/mockData";
import { calcularPrevisaoIndividual, PrevisaoPromocao } from "@/utils/promocaoUtils";
import TabelaPromocoes from "./TabelaPromocoes";

const GestaoPromocoes: React.FC = () => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoPromocao[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        // Filter active militaries
        const militaresAtivos = mockMilitares.filter(militar => militar.situacao === 'ativo');
        setMilitares(militaresAtivos);
        calcularPrevisaoPromocoes(militaresAtivos);
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
  
  const handlePromover = (previsao: PrevisaoPromocao) => {
    if (!previsao.proximoPosto) return;
    
    // Update the militar's rank and promotion date
    setMilitares(prevMilitares => {
      const newMilitares = prevMilitares.map(militar => {
        if (militar.id === previsao.militarId && previsao.proximoPosto) {
          const updatedMilitar = {
            ...militar,
            posto: previsao.proximoPosto,
            dataUltimaPromocao: new Date().toISOString()
          };
          
          // In a real application, here we would call an API to update the database
          console.log("Militar promovido:", updatedMilitar);
          
          return updatedMilitar;
        }
        return militar;
      });
      
      // Recalculate promotions with updated data
      calcularPrevisaoPromocoes(newMilitares);
      return newMilitares;
    });
    
    toast({
      title: "Promoção realizada",
      description: `${previsao.nome} foi promovido para ${previsao.proximoPosto}!`,
      duration: 5000,
    });
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
