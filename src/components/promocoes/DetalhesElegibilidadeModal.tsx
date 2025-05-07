
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Info, Check, AlertCircle, Clock, CalendarDays } from "lucide-react";
import { useElegibilidadePromocao } from "@/hooks/useElegibilidadePromocao";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Militar, PostoPatente } from "@/types";

interface DetalhesElegibilidadeModalProps {
  militarId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetalhesElegibilidadeModal = ({ militarId, open, onOpenChange }: DetalhesElegibilidadeModalProps) => {
  const { elegibilidade, loading, error } = useElegibilidadePromocao(militarId);
  const [militar, setMilitar] = useState<Militar | null>(null);

  useEffect(() => {
    const fetchMilitarData = async () => {
      if (!militarId) return;

      try {
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("id", militarId)
          .single();

        if (error) throw error;

        if (data) {
          // Converter para o formato Militar
          setMilitar({
            id: data.id,
            nome: data.nome,
            nomeCompleto: data.nome,
            nomeGuerra: data.nomeguerra || data.nome,
            posto: data.posto as PostoPatente,
            quadro: data.quadro as any,
            dataNascimento: data.datanascimento,
            dataInclusao: data.data_ingresso,
            dataUltimaPromocao: data.dataultimapromocao,
            situacao: data.situacao as any,
            email: data.email,
            foto: data.foto,
            tipoSanguineo: data.tipo_sanguineo as any,
            sexo: data.sexo as any,
            unidade: data.unidade
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do militar:", err);
      }
    };

    fetchMilitarData();
  }, [militarId]);

  if (!open) return null;

  const formatarData = (data: string | null): string => {
    if (!data) return "Data não disponível";
    try {
      return format(parseISO(data), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const getProximaPromoção = () => {
    if (!militar?.posto || !militar?.dataUltimaPromocao) return "Não disponível";
    
    try {
      const dataUlt = parseISO(militar.dataUltimaPromocao);
      let mesesNecessarios = 0;
      
      switch (militar.posto) {
        case "Soldado": mesesNecessarios = 24; break;
        case "Cabo": mesesNecessarios = 36; break;
        case "3º Sargento": mesesNecessarios = 48; break;
        case "2º Sargento": mesesNecessarios = 48; break;
        case "1º Sargento": mesesNecessarios = 36; break;
        case "2º Tenente": mesesNecessarios = 36; break;
        case "1º Tenente": mesesNecessarios = 48; break;
        case "Capitão": mesesNecessarios = 48; break;
        case "Major": mesesNecessarios = 48; break;
        case "Tenente-Coronel": mesesNecessarios = 36; break;
        default: return "Posto máximo";
      }
      
      // Adicionar os meses necessários
      const data = new Date(dataUlt);
      data.setMonth(data.getMonth() + mesesNecessarios);
      
      return format(data, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Não disponível";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes de Elegibilidade para Promoção</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Analisando critérios de elegibilidade...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !elegibilidade ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sem dados</AlertTitle>
            <AlertDescription>Não foi possível analisar a elegibilidade.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Informações do Militar */}
            {militar && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {militar.foto ? (
                        <img src={militar.foto} alt={militar.nomeGuerra} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold">{militar.nomeGuerra.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{militar.nomeGuerra}</h3>
                      <p className="text-gray-500">{militar.nome}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge>{militar.posto}</Badge>
                        <Badge variant="outline">{militar.quadro}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>Última promoção: {formatarData(militar.dataUltimaPromocao)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status de Elegibilidade */}
            <Card>
              <CardHeader>
                <CardTitle>Status de Elegibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {elegibilidade.elegivel ? (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-700">Elegível para Promoção</AlertTitle>
                      <AlertDescription className="text-green-600">
                        O militar cumpre todos os requisitos para promoção.
                      </AlertDescription>
                    </Alert>
                  ) : elegibilidade.parcialmenteElegivel ? (
                    <Alert className="bg-amber-50 border-amber-200">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-700">Parcialmente Elegível</AlertTitle>
                      <AlertDescription className="text-amber-600">
                        {elegibilidade.motivoInelegibilidade || "Alguns critérios ainda precisam ser cumpridos."}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-700">Não Elegível</AlertTitle>
                      <AlertDescription className="text-red-600">
                        {elegibilidade.motivoInelegibilidade || "O militar não atende aos requisitos para promoção."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="px-1 py-2">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Critérios cumpridos: {elegibilidade.criteriosCumpridos} de {elegibilidade.totalCriterios}</span>
                      <span className="font-medium">{Math.round((elegibilidade.criteriosCumpridos / elegibilidade.totalCriterios) * 100)}%</span>
                    </div>
                    <Progress value={(elegibilidade.criteriosCumpridos / elegibilidade.totalCriterios) * 100} className="h-2" />
                  </div>

                  {militar?.dataUltimaPromocao && (
                    <div className="flex justify-between text-sm border-t pt-3 mt-3">
                      <span className="text-gray-500">Próxima data mínima para promoção:</span>
                      <span className="font-medium">{getProximaPromoção()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lista de Critérios */}
            <Card>
              <CardHeader>
                <CardTitle>Critérios de Elegibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {elegibilidade.criterios.map((criterio) => (
                    <div key={criterio.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {criterio.cumprido ? (
                          <div className="size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="size-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p>{criterio.descricao}</p>
                          {criterio.observacao && (
                            <p className="text-sm text-gray-500">{criterio.observacao}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={criterio.cumprido ? "default" : "outline"} className={criterio.cumprido ? "bg-green-500" : ""}>
                        {criterio.cumprido ? "Cumprido" : "Pendente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
