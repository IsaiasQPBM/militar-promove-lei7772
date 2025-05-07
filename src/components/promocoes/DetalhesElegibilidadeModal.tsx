
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Clock, CalendarDays } from "lucide-react";
import { format, parseISO, differenceInMonths, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { PostoPatente, Militar, CriterioPromocao } from "@/types";
import { getCriteriosPromocao } from "@/services/promocaoService";
import { calcularPrevisaoIndividual } from "@/utils/promocaoUtils";

interface DetalhesElegibilidadeModalProps {
  militarId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetalhesElegibilidadeModal: React.FC<DetalhesElegibilidadeModalProps> = ({ 
  militarId, 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();
  const [militar, setMilitar] = useState<Militar | null>(null);
  const [loading, setLoading] = useState(true);
  const [cursosConcluidos, setCursosConcluidos] = useState<any[]>([]);
  const [criterios, setCriterios] = useState<string[]>([]);
  const [statusCriterios, setStatusCriterios] = useState<Record<string, "cumprido" | "pendente" | "nao-aplicavel">>({});
  const [observacoesCriterios, setObservacoesCriterios] = useState<Record<string, string>>({});
  const [previsao, setPrevisao] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !militarId) return;
      
      setLoading(true);
      try {
        // Buscar dados do militar
        const { data: militarData, error: militarError } = await supabase
          .from("militares")
          .select("*")
          .eq("id", militarId)
          .single();
          
        if (militarError) throw militarError;
        
        const militarObj: Militar = {
          id: militarData.id,
          nome: militarData.nome,
          nomeCompleto: militarData.nome,
          nomeGuerra: militarData.nomeguerra || militarData.nome,
          posto: militarData.posto as PostoPatente,
          quadro: militarData.quadro as any,
          dataNascimento: militarData.datanascimento || "",
          dataInclusao: militarData.data_ingresso || "",
          dataUltimaPromocao: militarData.dataultimapromocao || "",
          situacao: militarData.situacao as any,
          tipoSanguineo: militarData.tipo_sanguineo as any,
          sexo: militarData.sexo as any,
          email: militarData.email,
          foto: militarData.foto,
          unidade: militarData.unidade
        };
        
        setMilitar(militarObj);
        
        // Buscar cursos concluídos
        const { data: cursosMilitares, error: cursosMilitaresError } = await supabase
          .from("cursos_militares")
          .select("*")
          .eq("militar_id", militarId);
          
        if (cursosMilitaresError) throw cursosMilitaresError;
        
        const { data: cursosCivis, error: cursosCivisError } = await supabase
          .from("cursos_civis")
          .select("*")
          .eq("militar_id", militarId);
          
        if (cursosCivisError) throw cursosCivisError;
        
        setCursosConcluidos([
          ...(cursosMilitares || []).map(c => ({ ...c, categoria: 'militar' })),
          ...(cursosCivis || []).map(c => ({ ...c, categoria: 'civil' }))
        ]);
        
        // Buscar critérios de promoção baseados no posto atual
        if (militarObj.posto && militarObj.quadro) {
          const criteriosPromo = getCriteriosPromocao(militarObj.posto, militarObj.quadro);
          setCriterios(criteriosPromo);
          
          // Calcular previsão de promoção
          const previsaoPromo = calcularPrevisaoIndividual(militarObj);
          setPrevisao(previsaoPromo);
          
          // Avaliar status de cada critério
          const statusObj: Record<string, "cumprido" | "pendente" | "nao-aplicavel"> = {};
          const observacoesObj: Record<string, string> = {};
          
          // Para cada critério, verificar se foi cumprido
          criteriosPromo.forEach(criterio => {
            // Tempo mínimo no posto
            if (criterio.includes("tempo mínimo")) {
              if (previsaoPromo.dataProximaPromocao && previsaoPromo.tempoRestante === "Promoção disponível") {
                statusObj[criterio] = "cumprido";
                observacoesObj[criterio] = "Tempo mínimo atingido";
              } else {
                statusObj[criterio] = "pendente";
                observacoesObj[criterio] = previsaoPromo.tempoRestante 
                  ? `Faltam ${previsaoPromo.tempoRestante}` 
                  : "Tempo insuficiente no posto";
              }
            }
            // Aptidão física
            else if (criterio.includes("aptidão física")) {
              // Simplificação - assumimos que está apto
              statusObj[criterio] = "cumprido";
              observacoesObj[criterio] = "Considerado apto para promoção";
            }
            // Conceito profissional/moral
            else if (criterio.includes("conceito profissional")) {
              statusObj[criterio] = "cumprido";
              observacoesObj[criterio] = "Avaliação positiva";
            }
            // Cursos obrigatórios
            else if (criterio.includes("curso correspondente") || criterio.includes("Curso de")) {
              const cursosNecessarios = [];
              
              if (criterio.includes("Formação de Oficial")) cursosNecessarios.push("CFO");
              if (criterio.includes("Aperfeiçoamento de Oficial")) cursosNecessarios.push("CAO");
              
              // Verificar se possui os cursos necessários
              const temCursoNecessario = cursosNecessarios.length === 0 || 
                cursosNecessarios.some(cursoNec => 
                  cursosConcluidos.some(c => c.tipo === cursoNec || c.nome.includes(cursoNec))
                );
              
              if (temCursoNecessario) {
                statusObj[criterio] = "cumprido";
                observacoesObj[criterio] = "Curso(s) concluído(s)";
              } else {
                statusObj[criterio] = "pendente";
                observacoesObj[criterio] = `Necessário concluir: ${cursosNecessarios.join(", ")}`;
              }
            }
            // Quadro de Acesso
            else if (criterio.includes("Quadro de Acesso")) {
              // Simplificação - verificamos apenas se está no período
              const hoje = new Date();
              const proxJulho = new Date(hoje.getFullYear(), 6, 18);
              const proxDezembro = new Date(hoje.getFullYear(), 11, 23);
              
              const diasParaJulho = differenceInMonths(proxJulho, hoje) <= 1;
              const diasParaDezembro = differenceInMonths(proxDezembro, hoje) <= 1;
              
              if (diasParaJulho || diasParaDezembro) {
                statusObj[criterio] = "cumprido";
                observacoesObj[criterio] = "Período de inclusão ativo";
              } else {
                statusObj[criterio] = "pendente";
                const proxData = hoje < proxJulho ? proxJulho : proxDezembro;
                observacoesObj[criterio] = `Próxima inclusão em ${format(proxData, "dd/MM/yyyy")}`;
              }
            }
            // Outros critérios
            else {
              statusObj[criterio] = "nao-aplicavel";
              observacoesObj[criterio] = "Critério informativo";
            }
          });
          
          setStatusCriterios(statusObj);
          setObservacoesCriterios(observacoesObj);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast({
          title: "Erro ao carregar detalhes do militar",
          description: "Não foi possível recuperar as informações necessárias.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [militarId, open]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cumprido":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pendente":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "nao-aplicavel":
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "cumprido":
        return "bg-green-100 text-green-800 border-green-300";
      case "pendente":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "nao-aplicavel":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "cumprido":
        return "Cumprido";
      case "pendente":
        return "Pendente";
      case "nao-aplicavel":
        return "Informativo";
      default:
        return "";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes de Elegibilidade para Promoção</DialogTitle>
          <DialogDescription>
            Análise detalhada dos critérios de promoção conforme Lei 7.772/2022
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando detalhes...</p>
          </div>
        ) : militar ? (
          <>
            {/* Informações Básicas */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{militar.nomeGuerra}</h3>
                  <p className="text-gray-600 text-sm">{militar.posto} • {militar.quadro}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {militar.dataUltimaPromocao ? `Última promoção: ${format(parseISO(militar.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}` : "Sem dados de promoção"}
                    </span>
                  </div>
                </div>
                
                {previsao && previsao.proximoPosto && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Próximo Posto</div>
                    <Badge variant="outline" className="border-2 border-cbmepi-purple text-cbmepi-purple font-semibold">
                      {previsao.proximoPosto}
                    </Badge>
                    <div className="text-sm mt-1">
                      <Badge variant={previsao.tempoRestante === "Promoção disponível" ? "default" : "outline"}>
                        {previsao.tempoRestante}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Lista de Critérios */}
            <Card>
              <CardHeader className="bg-cbmepi-purple text-white py-2">
                <CardTitle className="text-base">Critérios de Elegibilidade</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Critério</TableHead>
                      <TableHead>Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criterios.map((criterio, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {getStatusIcon(statusCriterios[criterio] || "nao-aplicavel")}
                        </TableCell>
                        <TableCell className="font-medium">{criterio}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(statusCriterios[criterio] || "nao-aplicavel")}>
                            {getStatusText(statusCriterios[criterio] || "nao-aplicavel")}
                          </Badge>
                          <span className="ml-2 text-sm">
                            {observacoesCriterios[criterio] || ""}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Separator className="my-4" />
            
            {/* Resumo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumo da Situação</h3>
              <p className="text-sm">
                {Object.values(statusCriterios).filter(s => s === "pendente").length === 0 ? (
                  <span className="text-green-600">
                    O militar atende a todos os critérios necessários para promoção.
                  </span>
                ) : (
                  <span className="text-amber-600">
                    O militar possui {Object.values(statusCriterios).filter(s => s === "pendente").length} critérios pendentes 
                    que precisam ser atendidos antes da promoção.
                  </span>
                )}
              </p>
              
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Próximos Passos:</h4>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {Object.values(statusCriterios).filter(s => s === "pendente").length === 0 ? (
                    <li>Acompanhar o próximo quadro de acesso para promoções.</li>
                  ) : (
                    Object.entries(statusCriterios)
                      .filter(([_, status]) => status === "pendente")
                      .map(([criterio, _], idx) => (
                        <li key={idx}>
                          Resolver pendência: {criterio} - {observacoesCriterios[criterio]}
                        </li>
                      ))
                  )}
                </ul>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/ficha-militar/${militar.id}`)}
              >
                Ver Ficha Completa
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
            <h3 className="font-semibold text-lg">Militar não encontrado</h3>
            <p className="text-gray-500 text-center mt-1">
              Não foi possível encontrar os dados do militar solicitado.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
