
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Info, Award } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Militar } from "@/types";
import { calcularPrevisaoIndividual, PrevisaoPromocao } from "@/utils/promocaoUtils";
import { calcularProximaDataQuadroAcesso, verificarPeriodoQuadroAcesso, getCriteriosPromocao } from "@/services/promocaoService";
import TabelaPromocoes from "./TabelaPromocoes";
import { supabase } from "@/integrations/supabase/client";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const GestaoPromocoes: React.FC = () => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [previsoes, setPrevisoes] = useState<PrevisaoPromocao[]>([]);
  const [loading, setLoading] = useState(true);
  const [proximaDataQuadro, setProximaDataQuadro] = useState<Date>(new Date());
  const [emPeriodoQuadroAcesso, setEmPeriodoQuadroAcesso] = useState(false);
  
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
            nome: m.nome || "",
            nomeCompleto: m.nome || "",
            nomeGuerra: m.nomeguerra || m.nome || "",
            posto: toPostoPatente(m.posto),
            quadro: toQuadroMilitar(m.quadro),
            dataUltimaPromocao: m.dataultimapromocao || "",
            dataInclusao: m.data_ingresso || "",
            dataNascimento: m.datanascimento || "",
            tipoSanguineo: toTipoSanguineo(m.tipo_sanguineo),
            situacao: toSituacaoMilitar(m.situacao),
            email: m.email || "",
            foto: m.foto,
            sexo: toSexo(m.sexo),
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
    
    // Verificar períodos de quadro de acesso
    const proximaData = calcularProximaDataQuadroAcesso();
    setProximaDataQuadro(proximaData);
    setEmPeriodoQuadroAcesso(verificarPeriodoQuadroAcesso());
  }, []);
  
  const calcularPrevisaoPromocoes = (militares: Militar[]) => {
    // Também buscar as fichas de conceito para integração
    const fetchFichasConceito = async (militarIds: string[]) => {
      try {
        const { data: fichas } = await supabase
          .from("fichas_conceito")
          .select("*")
          .in("militar_id", militarIds);
          
        return fichas || [];
      } catch (error) {
        console.error("Erro ao buscar fichas de conceito:", error);
        return [];
      }
    };
    
    const processarDados = async () => {
      // Obter todos os IDs de militares
      const militarIds = militares.map(m => m.id);
      
      // Buscar fichas de conceito
      const fichasConceito = await fetchFichasConceito(militarIds);
      
      // Mapear pontuações por militar_id
      const pontuacoesPorMilitar = new Map();
      fichasConceito.forEach(ficha => {
        pontuacoesPorMilitar.set(ficha.militar_id, ficha.totalpontos || 0);
      });
      
      // Calcular previsões e adicionar pontuação
      const previsoes: PrevisaoPromocao[] = militares
        .map(militar => {
          const previsao = calcularPrevisaoIndividual(militar);
          // Adicionar pontuação da ficha de conceito
          previsao.pontuacao = pontuacoesPorMilitar.get(militar.id) || 0;
          return previsao;
        })
        .filter(p => p.proximoPosto !== null)
        .sort((a, b) => {
          if (!a.dataProximaPromocao || !b.dataProximaPromocao) return 0;
          return a.dataProximaPromocao.getTime() - b.dataProximaPromocao.getTime();
        });
      
      setPrevisoes(previsoes);
    };
    
    processarDados();
  };

  // Obtém critérios genéricos de promoção para oficiais e praças
  const criteriosOficiais = getCriteriosPromocao("Capitão", "QOEM");
  const criteriosPracas = getCriteriosPromocao("3º Sargento", "QPBM");
  
  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Análise de Elegibilidade para Promoções
        </CardTitle>
        <CardDescription className="text-white">
          Conforme Lei 7.772/2022 - As inclusões no Quadro de Acesso ocorrem em 18 de julho e 23 de dezembro
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {emPeriodoQuadroAcesso && (
          <div className="mb-6 p-4 bg-green-100 border border-green-500 rounded-md">
            <p className="text-green-700 font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2" /> 
              Hoje é dia de inclusão no Quadro de Acesso para Promoções.
            </p>
          </div>
        )}
        
        {!emPeriodoQuadroAcesso && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700">
              A próxima data de inclusão no Quadro de Acesso será{' '}
              <span className="font-semibold">
                {format(proximaDataQuadro, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </p>
          </div>
        )}

        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="criterios">
            <AccordionTrigger className="text-lg font-semibold">
              Critérios de Promoção (Lei 7.772/2022)
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Para Oficiais:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {criteriosOficiais.map((criterio, index) => (
                      <li key={`oficial-${index}`}>{criterio}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Para Praças:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {criteriosPracas.map((criterio, index) => (
                      <li key={`praca-${index}`}>{criterio}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-amber-800">
                  <strong>Importante:</strong> A promoção é um ato administrativo do Comandante Geral 
                  em conjunto com o Governador do Estado. Este sistema fornece apenas análise informativa
                  de elegibilidade conforme critérios da legislação.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {loading ? (
          <div className="text-center py-8">Carregando previsões de promoções...</div>
        ) : previsoes.length === 0 ? (
          <div className="text-center py-8">Nenhuma previsão de promoção encontrada</div>
        ) : (
          <TabelaPromocoes 
            previsoes={previsoes} 
          />
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 text-sm text-gray-600 italic">
        Este sistema calcula automaticamente as datas previstas para as possíveis próximas promoções 
        com base no tempo mínimo exigido em cada posto/graduação conforme a Lei 7.772/2022.
      </CardFooter>
    </Card>
  );
};

export default GestaoPromocoes;
