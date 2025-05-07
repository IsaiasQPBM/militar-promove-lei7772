
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuadroMilitar, MilitarComPontuacao } from "@/types";
import { Search, Info } from "lucide-react";

interface MerecimentoListProps {
  militares: MilitarComPontuacao[];
  onQuadroChange: (quadro: QuadroMilitar) => void;
  quadroAtual: QuadroMilitar;
  onShowDetails: (militarId: string, posto: string, quadro: string) => void;
}

export const MerecimentoList: React.FC<MerecimentoListProps> = ({
  militares,
  onQuadroChange,
  quadroAtual,
  onShowDetails
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Ordenar militares por pontuação (maior para menor)
  const militaresOrdenados = [...militares].sort((a, b) => b.pontuacao - a.pontuacao);
  
  // Filtrar militares pela pesquisa
  const militaresFiltrados = militaresOrdenados.filter(militar =>
    militar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    militar.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    militar.posto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar se o militar está elegível para promoção por merecimento
  const checkElegibilidadeMerecimento = (militar: MilitarComPontuacao) => {
    // Pontuação mínima por posto (valores fictícios para exemplo)
    const minPontuacao: Record<string, number> = {
      "Coronel": Infinity, // Posto máximo
      "Tenente-Coronel": 15,
      "Major": 12,
      "Capitão": 10,
      "1º Tenente": 7,
      "2º Tenente": 5,
      "Subtenente": Infinity, // Graduação máxima para praças
      "1º Sargento": 10,
      "2º Sargento": 8,
      "3º Sargento": 6,
      "Cabo": 4,
      "Soldado": 2,
    };
    
    // Verifica posto máximo
    if (minPontuacao[militar.posto] === Infinity) {
      return "nao_elegivel";
    }
    
    // Verifica pontuação mínima
    if (militar.pontuacao >= minPontuacao[militar.posto]) {
      return "elegivel";
    } else if (militar.pontuacao >= minPontuacao[militar.posto] * 0.75) {
      return "parcial";
    } else {
      return "nao_elegivel";
    }
  };

  const renderElegibilidadeBadge = (status: string) => {
    switch (status) {
      case "elegivel":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Elegível</Badge>;
      case "parcial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Parcialmente Elegível</Badge>;
      case "nao_elegivel":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Não Elegível</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar militar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="w-full sm:w-64">
          <Select
            value={quadroAtual}
            onValueChange={(value: string) => onQuadroChange(value as QuadroMilitar)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o quadro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QOEM">QOEM</SelectItem>
              <SelectItem value="QOE">QOE</SelectItem>
              <SelectItem value="QOBM-S">QOBM-S</SelectItem>
              <SelectItem value="QOBM-E">QOBM-E</SelectItem>
              <SelectItem value="QOBM-C">QOBM-C</SelectItem>
              <SelectItem value="QPBM">QPBM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Posto</TableHead>
              <TableHead>Pontuação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {militaresFiltrados.length > 0 ? (
              militaresFiltrados.map((militar) => {
                const elegibilidade = checkElegibilidadeMerecimento(militar);
                return (
                  <TableRow key={militar.id}>
                    <TableCell className="font-medium">{militar.nome}</TableCell>
                    <TableCell>{militar.posto}</TableCell>
                    <TableCell>
                      <span className="font-medium">{militar.pontuacao.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      {renderElegibilidadeBadge(elegibilidade)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onShowDetails(militar.id, militar.posto, militar.quadro)}
                      >
                        <Info className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhum militar encontrado para os critérios selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
