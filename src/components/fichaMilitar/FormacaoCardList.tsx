import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText, Plus } from "lucide-react";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { FormacaoEducacionalDialog } from "./FormacaoEducacionalDialog";
import { CondecoracaoElogioDialog } from "./CondecoracaoElogioDialog";
import { PunicaoDialog } from "./PunicaoDialog";

interface FormacaoCardListProps {
  militarId: string;
  tipo: "cursos_militares" | "cursos_civis" | "condecoracoes" | "elogios" | "punicoes";
  items: (CursoMilitar | CursoCivil | Condecoracao | Elogio | Punicao)[];
  onRefresh: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export const FormacaoCardList: React.FC<FormacaoCardListProps> = ({
  militarId,
  tipo,
  items,
  onRefresh,
  onEdit,
  onDelete
}) => {
  // Funções para renderizar os títulos e botões corretos baseados no tipo
  const getTitulo = () => {
    switch (tipo) {
      case "cursos_militares": return "Cursos Militares";
      case "cursos_civis": return "Cursos Civis";
      case "condecoracoes": return "Condecorações";
      case "elogios": return "Elogios";
      case "punicoes": return "Punições";
      default: return "Itens";
    }
  };
  
  const renderDialogButton = () => {
    if (tipo === "cursos_militares") {
      return (
        <FormacaoEducacionalDialog 
          militarId={militarId} 
          formacaoTipo="cursos_militares" 
          onSuccess={onRefresh} 
        />
      );
    } else if (tipo === "cursos_civis") {
      return (
        <FormacaoEducacionalDialog 
          militarId={militarId} 
          formacaoTipo="cursos_civis" 
          onSuccess={onRefresh} 
        />
      );
    } else if (tipo === "condecoracoes") {
      return (
        <CondecoracaoElogioDialog 
          militarId={militarId} 
          tipo="condecoracao" 
          onSuccess={onRefresh} 
        />
      );
    } else if (tipo === "elogios") {
      return (
        <CondecoracaoElogioDialog 
          militarId={militarId} 
          tipo="elogio" 
          onSuccess={onRefresh} 
        />
      );
    } else if (tipo === "punicoes") {
      return (
        <PunicaoDialog 
          militarId={militarId} 
          onSuccess={onRefresh} 
        />
      );
    }
    return null;
  };
  
  const renderCardContent = (item: any) => {
    if (tipo === "cursos_militares" || tipo === "cursos_civis") {
      // Cursos militares e civis
      return (
        <>
          <div className="font-medium">{item.nome}</div>
          <div className="text-sm text-gray-600">{item.tipo} - {item.instituicao}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>Carga Horária: {item.cargahoraria}h</span>
            <span className="font-bold">Pontos: {item.pontos}</span>
          </div>
        </>
      );
    } else if (tipo === "condecoracoes" || tipo === "elogios") {
      // Condecorações e elogios
      return (
        <>
          <div className="font-medium">{item.tipo}</div>
          <div className="text-sm text-gray-600">{item.descricao}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{item.datarecebimento && format(new Date(item.datarecebimento), "dd/MM/yyyy", { locale: ptBR })}</span>
            <span className="font-bold">Pontos: {item.pontos}</span>
          </div>
        </>
      );
    } else if (tipo === "punicoes") {
      // Punições
      return (
        <>
          <div className="font-medium text-red-600">{item.tipo}</div>
          <div className="text-sm text-gray-600">{item.descricao}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{item.datarecebimento && format(new Date(item.datarecebimento), "dd/MM/yyyy", { locale: ptBR })}</span>
            <span className="font-bold text-red-600">Pontos: {item.pontos}</span>
          </div>
        </>
      );
    }
    return null;
  };
  
  // Calcular total de pontos
  const calcularTotalPontos = () => {
    return items.reduce((sum, item) => sum + (item.pontos || 0), 0);
  };
  
  // Obter o texto do botão baseado no tipo
  const getBotaoTexto = () => {
    switch (tipo) {
      case "cursos_militares": return "Adicionar Curso Militar";
      case "cursos_civis": return "Adicionar Curso Civil";
      case "condecoracoes": return "Adicionar Condecoração";
      case "elogios": return "Adicionar Elogio";
      case "punicoes": return "Adicionar Punição";
      default: return "Adicionar Item";
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">{getTitulo()}</CardTitle>
        <div className="w-auto">
          {renderDialogButton()}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Nenhum registro encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
              >
                {renderCardContent(item)}
                
                {(onEdit || onDelete || ('anexo' in item && item.anexo)) && (
                  <div className="flex justify-end mt-2 gap-2">
                    {'anexo' in item && item.anexo && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-blue-600"
                        onClick={() => window.open(item.anexo as string, '_blank')}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" /> Anexo
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-amber-600"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-red-600"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="font-medium">Total de registros: {items.length}</span>
              <span className="font-bold">
                Total de pontos: {calcularTotalPontos()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
