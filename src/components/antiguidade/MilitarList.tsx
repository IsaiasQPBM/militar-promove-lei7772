
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
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Info } from "lucide-react";

interface MilitarListProps {
  militares: MilitarComPontuacao[];
  onQuadroChange: (quadro: QuadroMilitar) => void;
  quadroAtual: QuadroMilitar;
  onShowDetails: (militarId: string, posto: string, quadro: string) => void;
}

export const MilitarList: React.FC<MilitarListProps> = ({
  militares,
  onQuadroChange,
  quadroAtual,
  onShowDetails
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar militares pela pesquisa
  const militaresFiltrados = militares.filter(militar =>
    militar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    militar.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    militar.posto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar se o militar está elegível para promoção (simplificado)
  const checkElegibilidade = (militar: MilitarComPontuacao) => {
    if (!militar.dataUltimaPromocao) return "indefinido";
    
    // Lógica simplificada de elegibilidade por tempo
    const minTempoEmMeses: Record<string, number> = {
      "Coronel": Infinity, // Posto máximo
      "Tenente-Coronel": 36, // 3 anos
      "Major": 48, // 4 anos
      "Capitão": 48, // 4 anos
      "1º Tenente": 48, // 4 anos
      "2º Tenente": 36, // 3 anos
      "Subtenente": Infinity, // Graduação máxima
      "1º Sargento": 36, // 3 anos
      "2º Sargento": 48, // 4 anos
      "3º Sargento": 48, // 4 anos
      "Cabo": 36, // 3 anos
      "Soldado": 24, // 2 anos
    };
    
    const ultimaPromocao = new Date(militar.dataUltimaPromocao);
    const hoje = new Date();
    const diffMeses = (hoje.getFullYear() - ultimaPromocao.getFullYear()) * 12 + 
                       (hoje.getMonth() - ultimaPromocao.getMonth());
    
    // Verifica posto máximo
    if (minTempoEmMeses[militar.posto] === Infinity) {
      return "nao_elegivel";
    }
    
    // Verifica tempo mínimo
    if (diffMeses >= minTempoEmMeses[militar.posto]) {
      return "elegivel";
    } else if (diffMeses >= minTempoEmMeses[militar.posto] * 0.75) {
      return "parcial";
    } else {
      return "nao_elegivel";
    }
  };

  const renderTempoUltimaPromocao = (dataUltimaPromocao: string | null) => {
    if (!dataUltimaPromocao) return "Não disponível";
    
    try {
      const data = new Date(dataUltimaPromocao);
      return formatDistanceToNow(data, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return "Data inválida";
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
              <TableHead className="hidden md:table-cell">Última Promoção</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {militaresFiltrados.length > 0 ? (
              militaresFiltrados.map((militar) => {
                const elegibilidade = checkElegibilidade(militar);
                return (
                  <TableRow key={militar.id}>
                    <TableCell className="font-medium">{militar.nome}</TableCell>
                    <TableCell>{militar.posto}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {renderTempoUltimaPromocao(militar.dataUltimaPromocao)}
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
