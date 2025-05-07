
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useElegibilidadePromocao } from "@/hooks/useElegibilidadePromocao";
import { Loader2, Check, X, AlertCircle } from "lucide-react";

interface DetalhesElegibilidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  militarId: string | null;
  posto: string;
  quadro: string;
}

const DetalhesElegibilidadeModal: React.FC<DetalhesElegibilidadeModalProps> = ({
  isOpen,
  onClose,
  militarId,
  posto,
  quadro
}) => {
  const { elegibilidade, loading, error } = useElegibilidadePromocao(militarId);

  const renderCriterioStatus = (cumprido: boolean, observacao?: string) => {
    if (cumprido) {
      return (
        <div className="flex items-center">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mr-2">
            <Check className="h-4 w-4 mr-1" /> Cumprido
          </Badge>
          {observacao && <span className="text-sm text-gray-500">{observacao}</span>}
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 mr-2">
            <X className="h-4 w-4 mr-1" /> Pendente
          </Badge>
          {observacao && <span className="text-sm text-gray-500">{observacao}</span>}
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes de Elegibilidade para Promoção</DialogTitle>
          <DialogDescription>
            Critérios avaliados conforme Leis 7.772/2022 e 5.461/2005
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando critérios...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar detalhes de elegibilidade
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        ) : elegibilidade ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">Status de elegibilidade:</span>{" "}
                {elegibilidade.elegivel ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Elegível
                  </Badge>
                ) : elegibilidade.parcialmenteElegivel ? (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    Parcialmente Elegível
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                    Não Elegível
                  </Badge>
                )}
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  {elegibilidade.criteriosCumpridos} de {elegibilidade.totalCriterios} critérios cumpridos
                </span>
              </div>
            </div>

            <Separator />

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Critérios de Promoção</h3>
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-200">
                    {elegibilidade.criterios.map((criterio) => (
                      <li key={criterio.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span>{criterio.descricao}</span>
                          {renderCriterioStatus(criterio.cumprido, criterio.observacao)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {elegibilidade.pontuacaoMinima !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Pontuação Lei 5.461:</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{elegibilidade.pontuacaoAtual || 0} pontos</span>
                    {elegibilidade.pontuacaoAtual !== undefined && 
                     elegibilidade.pontuacaoMinima !== undefined && 
                     elegibilidade.pontuacaoAtual < elegibilidade.pontuacaoMinima && (
                      <span className="text-sm text-red-500 ml-2">
                        (mínimo necessário: {elegibilidade.pontuacaoMinima})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {elegibilidade.motivoInelegibilidade && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Motivo de inelegibilidade
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      {elegibilidade.motivoInelegibilidade}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Não foi possível carregar os detalhes de elegibilidade.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesElegibilidadeModal;
