
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addYears, differenceInDays, differenceInMonths, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Militar, PostoPatente, QuadroMilitar } from "@/types";
import { Award, Calendar } from "lucide-react";

// Interface para previsão de promoção
interface PrevisaoPromocao {
  militarId: string;
  nome: string;
  posto: PostoPatente;
  proximoPosto: PostoPatente | null;
  dataUltimaPromocao: Date;
  dataProximaPromocao: Date | null;
  tempoRestante: string;
  criterio: string;
}

// Interface com tempo mínimo para promoções por posto segundo a Lei 7.772/2022
interface TempoPromocoesInterface {
  [key: string]: {
    tempoMinimo: number; // em anos
    criterio: string;
    proximoPosto: PostoPatente | null;
  };
}

// Tempo mínimo para promoções de Oficiais
const tempoPromocoesOficiais: TempoPromocoesInterface = {
  "2º Tenente": { tempoMinimo: 2, criterio: "Antiguidade", proximoPosto: "1º Tenente" },
  "1º Tenente": { tempoMinimo: 4, criterio: "Antiguidade", proximoPosto: "Capitão" },
  "Capitão": { tempoMinimo: 4, criterio: "Merecimento", proximoPosto: "Major" },
  "Major": { tempoMinimo: 3, criterio: "Merecimento", proximoPosto: "Tenente-Coronel" },
  "Tenente-Coronel": { tempoMinimo: 2, criterio: "Merecimento", proximoPosto: "Coronel" },
  "Coronel": { tempoMinimo: 0, criterio: "Posto máximo", proximoPosto: null }
};

// Tempo mínimo para promoções de Praças
const tempoPromocoesPracas: TempoPromocoesInterface = {
  "Soldado": { tempoMinimo: 2, criterio: "Antiguidade", proximoPosto: "Cabo" },
  "Cabo": { tempoMinimo: 3, criterio: "Antiguidade", proximoPosto: "3º Sargento" },
  "3º Sargento": { tempoMinimo: 4, criterio: "Antiguidade", proximoPosto: "2º Sargento" },
  "2º Sargento": { tempoMinimo: 4, criterio: "Merecimento", proximoPosto: "1º Sargento" },
  "1º Sargento": { tempoMinimo: 3, criterio: "Merecimento", proximoPosto: "Subtenente" },
  "Subtenente": { tempoMinimo: 0, criterio: "Graduação máxima", proximoPosto: null }
};

const GestaoPromocoes: React.FC = () => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoPromocao[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os militares ativos
        const { data, error } = await supabase
          .from('militares')
          .select('*')
          .eq('situacao', 'ativo');
          
        if (error) throw error;
        
        if (data) {
          setMilitares(data);
          calcularPrevisaoPromocoes(data);
        }
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitares();
  }, []);
  
  // Função para calcular previsão de promoções de todos os militares
  const calcularPrevisaoPromocoes = (militares: Militar[]) => {
    const previsoes: PrevisaoPromocao[] = militares.map(militar => {
      return calcularPrevisaoIndividual(militar);
    }).filter(p => p.proximoPosto !== null); // Remover militares que já estão no posto máximo
    
    // Ordenar por data da próxima promoção (mais próximas primeiro)
    previsoes.sort((a, b) => {
      if (!a.dataProximaPromocao || !b.dataProximaPromocao) return 0;
      return a.dataProximaPromocao.getTime() - b.dataProximaPromocao.getTime();
    });
    
    setPrevisoes(previsoes);
  };
  
  // Função para calcular a previsão de promoção de um militar individual
  const calcularPrevisaoIndividual = (militar: Militar): PrevisaoPromocao => {
    // Verificar se é oficial ou praça
    const isOficial = ["QOEM", "QOE", "QORR"].includes(militar.quadro);
    const tabela = isOficial ? tempoPromocoesOficiais : tempoPromocoesPracas;
    
    // Obter informações para o posto atual
    const infoProximaPromocao = tabela[militar.posto] || { 
      tempoMinimo: 0, 
      criterio: "Sem informação", 
      proximoPosto: null 
    };
    
    // Converter data da última promoção para Date
    const dataUltimaPromocao = new Date(militar.dataUltimaPromocao);
    
    // Calcular data da próxima promoção
    let dataProximaPromocao: Date | null = null;
    let tempoRestante = "N/A";
    
    if (infoProximaPromocao.proximoPosto) {
      dataProximaPromocao = addYears(dataUltimaPromocao, infoProximaPromocao.tempoMinimo);
      
      // Calcular tempo restante
      const hoje = new Date();
      const diasRestantes = differenceInDays(dataProximaPromocao, hoje);
      const mesesRestantes = differenceInMonths(dataProximaPromocao, hoje);
      
      if (diasRestantes < 0) {
        tempoRestante = "Promoção disponível";
      } else if (mesesRestantes < 1) {
        tempoRestante = `${diasRestantes} dias`;
      } else if (mesesRestantes < 12) {
        tempoRestante = `${mesesRestantes} meses`;
      } else {
        const anos = Math.floor(mesesRestantes / 12);
        const mesesRestantesFinal = mesesRestantes % 12;
        tempoRestante = `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantesFinal} ${mesesRestantesFinal === 1 ? 'mês' : 'meses'}`;
      }
    }
    
    return {
      militarId: militar.id,
      nome: militar.nomeGuerra,
      posto: militar.posto,
      proximoPosto: infoProximaPromocao.proximoPosto,
      dataUltimaPromocao: dataUltimaPromocao,
      dataProximaPromocao,
      tempoRestante,
      criterio: infoProximaPromocao.criterio
    };
  };
  
  // Função para obter a classe CSS da badge com base no tempo restante
  const getBadgeVariant = (tempoRestante: string) => {
    if (tempoRestante === "Promoção disponível") {
      return "bg-green-500 hover:bg-green-600";
    } else if (tempoRestante.includes("dias") || tempoRestante.includes("mês") || tempoRestante.includes("meses") && !tempoRestante.includes("ano")) {
      return "bg-yellow-500 hover:bg-yellow-600";
    } else {
      return "bg-blue-500 hover:bg-blue-600";
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Posto Atual</TableHead>
                <TableHead>Próximo Posto</TableHead>
                <TableHead>Data Última Promoção</TableHead>
                <TableHead>Data Prevista</TableHead>
                <TableHead>Tempo Restante</TableHead>
                <TableHead>Critério</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previsoes.map((previsao) => (
                <TableRow key={previsao.militarId}>
                  <TableCell className="font-medium">{previsao.nome}</TableCell>
                  <TableCell>{previsao.posto}</TableCell>
                  <TableCell>{previsao.proximoPosto}</TableCell>
                  <TableCell>
                    {format(previsao.dataUltimaPromocao, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {previsao.dataProximaPromocao 
                      ? format(previsao.dataProximaPromocao, "dd/MM/yyyy", { locale: ptBR }) 
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeVariant(previsao.tempoRestante)}>
                      {previsao.tempoRestante}
                    </Badge>
                  </TableCell>
                  <TableCell>{previsao.criterio}</TableCell>
                  <TableCell>
                    {previsao.tempoRestante === "Promoção disponível" && (
                      <Button 
                        size="sm" 
                        className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                      >
                        Promover
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default GestaoPromocoes;
