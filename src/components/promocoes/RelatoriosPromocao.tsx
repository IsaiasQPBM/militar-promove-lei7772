
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileDown, PrinterIcon, FileText } from "lucide-react";
import { Militar } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RelatoriosPromocaoProps {
  militaresElegiveis: Militar[];
  todosMilitares: Militar[];
}

export const RelatoriosPromocao = ({ militaresElegiveis, todosMilitares }: RelatoriosPromocaoProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("elegibilidade");
  const [filtroQuadro, setFiltroQuadro] = useState("todos");
  const [filtroPosto, setFiltroPosto] = useState("todos");

  // Exportar para CSV
  const exportarCSV = (dados: any[], nomeArquivo: string) => {
    // Headers do CSV
    const headers = [
      "NOME", "NOME_GUERRA", "POSTO", "QUADRO", 
      "DATA_ULTIMA_PROMOCAO", "SITUACAO", "UNIDADE"
    ];
    
    // Mapear dados para o formato CSV
    const rows = dados.map(militar => [
      militar.nome,
      militar.nomeGuerra,
      militar.posto,
      militar.quadro,
      militar.dataUltimaPromocao || "",
      militar.situacao,
      militar.unidade || ""
    ]);
    
    // Juntar headers e rows
    const csvData = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    // Criar blob e link para download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrar militares baseado nos critérios
  const filtrarMilitares = (militares: Militar[]) => {
    let resultado = [...militares];
    
    if (filtroQuadro !== "todos") {
      resultado = resultado.filter(m => m.quadro === filtroQuadro);
    }
    
    if (filtroPosto !== "todos") {
      resultado = resultado.filter(m => m.posto === filtroPosto);
    }
    
    return resultado;
  };

  const militaresElegiveisExibidos = filtrarMilitares(militaresElegiveis);
  const todosMilitaresExibidos = filtrarMilitares(todosMilitares);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Relatórios
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatórios de Promoção</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <Label htmlFor="filtro-quadro">Filtrar por Quadro</Label>
              <Select value={filtroQuadro} onValueChange={setFiltroQuadro}>
                <SelectTrigger id="filtro-quadro" className="mt-1">
                  <SelectValue placeholder="Selecione um quadro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Quadros</SelectItem>
                  <SelectItem value="QOEM">QOEM</SelectItem>
                  <SelectItem value="QOE">QOE</SelectItem>
                  <SelectItem value="QOBM-S">QOBM-S</SelectItem>
                  <SelectItem value="QOBM-E">QOBM-E</SelectItem>
                  <SelectItem value="QOBM-C">QOBM-C</SelectItem>
                  <SelectItem value="QPBM">QPBM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-1/2">
              <Label htmlFor="filtro-posto">Filtrar por Posto</Label>
              <Select value={filtroPosto} onValueChange={setFiltroPosto}>
                <SelectTrigger id="filtro-posto" className="mt-1">
                  <SelectValue placeholder="Selecione um posto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Postos</SelectItem>
                  <SelectItem value="Coronel">Coronel</SelectItem>
                  <SelectItem value="Tenente-Coronel">Tenente-Coronel</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Capitão">Capitão</SelectItem>
                  <SelectItem value="1º Tenente">1º Tenente</SelectItem>
                  <SelectItem value="2º Tenente">2º Tenente</SelectItem>
                  <SelectItem value="Subtenente">Subtenente</SelectItem>
                  <SelectItem value="1º Sargento">1º Sargento</SelectItem>
                  <SelectItem value="2º Sargento">2º Sargento</SelectItem>
                  <SelectItem value="3º Sargento">3º Sargento</SelectItem>
                  <SelectItem value="Cabo">Cabo</SelectItem>
                  <SelectItem value="Soldado">Soldado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="elegibilidade">Elegíveis para Promoção</TabsTrigger>
              <TabsTrigger value="completo">Todos os Militares</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elegibilidade" className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">
                  Militares Elegíveis ({militaresElegiveisExibidos.length})
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportarCSV(militaresElegiveisExibidos, 'militares_elegiveis')}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" /> Exportar CSV
                </Button>
              </div>
              
              {militaresElegiveisExibidos.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Militar</TableHead>
                        <TableHead>Posto</TableHead>
                        <TableHead>Quadro</TableHead>
                        <TableHead>Última Promoção</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {militaresElegiveisExibidos.map(militar => (
                        <TableRow key={militar.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{militar.nomeGuerra}</p>
                              <p className="text-xs text-muted-foreground">{militar.nome}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{militar.posto}</Badge>
                          </TableCell>
                          <TableCell>{militar.quadro}</TableCell>
                          <TableCell>
                            {militar.dataUltimaPromocao 
                              ? format(new Date(militar.dataUltimaPromocao), 'dd/MM/yyyy', { locale: ptBR }) 
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{militar.situacao}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum militar elegível encontrado com os filtros selecionados.
                </div>
              )}
              
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium">Opções de Relatório</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <PrinterIcon className="h-4 w-4" /> Imprimir Relatório
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex items-center gap-2 bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                    onClick={() => exportarCSV(militaresElegiveisExibidos, 'militares_elegiveis')}
                  >
                    <FileDown className="h-4 w-4" /> Exportar para CSV
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="completo" className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">
                  Lista Completa de Militares ({todosMilitaresExibidos.length})
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportarCSV(todosMilitaresExibidos, 'todos_militares')}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" /> Exportar CSV
                </Button>
              </div>
              
              {todosMilitaresExibidos.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Militar</TableHead>
                        <TableHead>Posto</TableHead>
                        <TableHead>Quadro</TableHead>
                        <TableHead>Última Promoção</TableHead>
                        <TableHead>Unidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todosMilitaresExibidos.map(militar => (
                        <TableRow key={militar.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{militar.nomeGuerra}</p>
                              <p className="text-xs text-muted-foreground">{militar.nome}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{militar.posto}</Badge>
                          </TableCell>
                          <TableCell>{militar.quadro}</TableCell>
                          <TableCell>
                            {militar.dataUltimaPromocao 
                              ? format(new Date(militar.dataUltimaPromocao), 'dd/MM/yyyy', { locale: ptBR }) 
                              : "N/A"}
                          </TableCell>
                          <TableCell>{militar.unidade || "Não informado"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum militar encontrado com os filtros selecionados.
                </div>
              )}
              
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium">Opções de Relatório</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <PrinterIcon className="h-4 w-4" /> Imprimir Relatório
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex items-center gap-2 bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                    onClick={() => exportarCSV(todosMilitaresExibidos, 'todos_militares')}
                  >
                    <FileDown className="h-4 w-4" /> Exportar para CSV
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
