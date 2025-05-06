
import React from "react";
import { Militar } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, Eye } from "lucide-react";

interface MilitarCardProps {
  militar: Militar;
  onView: () => void;
  onEdit: () => void;
}

export const MilitarCard: React.FC<MilitarCardProps> = ({ militar, onView, onEdit }) => {
  const renderPostoGraduacao = (posto: string) => {
    const postoBadgeClass = {
      "Subtenente": "bg-emerald-100 text-emerald-800",
      "1º Sargento": "bg-cyan-100 text-cyan-800",
      "2º Sargento": "bg-sky-100 text-sky-800",
      "3º Sargento": "bg-blue-100 text-blue-800",
      "Cabo": "bg-indigo-100 text-indigo-800",
      "Soldado": "bg-violet-100 text-violet-800",
    }[posto] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${postoBadgeClass}`}>
        {posto}
      </span>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-3">
            {militar.foto ? (
              <img
                src={militar.foto}
                alt={militar.nomeGuerra || militar.nome}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                {(militar.nomeGuerra || militar.nome).charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-medium">{militar.nomeGuerra || militar.nome}</h3>
              <div className="mt-1">{renderPostoGraduacao(militar.posto)}</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 truncate">
            {militar.nome}
          </div>
        </div>
        <div className="border-t flex">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none h-10"
            onClick={onView}
          >
            <Eye className="h-4 w-4 mr-1" /> Ver Ficha
          </Button>
          <div className="border-l" />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none h-10"
            onClick={onEdit}
          >
            <FileEdit className="h-4 w-4 mr-1" /> Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
