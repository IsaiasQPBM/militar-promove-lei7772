
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { FileText, FileSpreadsheet, FilePlus, FileExport, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Militar } from "@/types";

interface RelatoriosPromocaoProps {
  militaresElegiveis: Militar[];
  todosMilitares: Militar[];
}

export const RelatoriosPromocao: React.FC<RelatoriosPromocaoProps> = ({ 
  militaresElegiveis, 
  todosMilitares 
}) => {
  const [tipoRelatorio, setTipoRelatorio] = useState("elegiveis");
  const [formatoExportacao, setFormatoExportacao] = useState("pdf");
  const [filtroQuadro, setFiltroQuadro] = useState("todos");
  const [filtroPosto, setFiltroPosto] = useState("todos");
  const [camposSelecionados, setCamposSelecionados] = useState({
    nomeCompleto: true,
    posto: true,
    quadro: true,
    dataUltimaPromocao: true,
    tempoServico: true,
    criterio: true,
    proximoPosto: true,
    pontuacao: true
  });
  
  const toggleCampo = (campo: keyof typeof camposSelecionados) => {
    setCamposSelecionados(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };
  
  const filtrarMilitares = () => {
    // Selecionar a lista base de acordo com o tipo de relatório
    let militaresFiltrados = tipoRelatorio === "elegiveis" ? militaresElegiveis : todosMilitares;
    
    // Aplicar filtro por quadro
    if (filtroQuadro !== "todos") {
      militaresFiltrados = militaresFiltrados.filter(militar => militar.quadro === filtroQuadro);
    }
    
    // Aplicar filtro por posto
    if (filtroPosto !== "todos") {
      militaresFiltrados = militaresFiltrados.filter(militar => militar.posto === filtroPosto);
    }
    
    return militaresFiltrados;
  };
  
  const gerarRelatorio = () => {
    const militaresFiltrados = filtrarMilitares();
    
    // Aqui implementaríamos a geração real do relatório
    // Por enquanto, apenas mostramos informações no toast
    
    toast({
      title: "Relatório gerado com sucesso",
      description: `${militaresFiltrados.length} militares incluídos no relatório ${formatoExportacao.toUpperCase()}.`
    });
    
    // Simular download
    setTimeout(() => {
      const dataFormatada = format(new Date(), "yyyy-MM-dd", { locale: ptBR });
      const nomeArquivo = `relatorio-promocoes-${dataFormatada}.${formatoExportacao}`;
      
      toast({
        title: "Download iniciado",
        description: `Arquivo: ${nomeArquivo}`
      });
    }, 1000);
  };
  
  const getDescricaoRelatorio = () => {
    switch (tipoRelatorio) {
      case "elegiveis":
        return "Militares que atendem aos critérios para promoção na próxima janela.";
      case "merecimento":
        return "Militares organizados por pontuação de merecimento (do maior para o menor).";
      case "antiguidade":
        return "Militares organizados por tempo de serviço no posto atual.";
      case "quadro-acesso":
        return "Lista de militares incluídos no Quadro de Acesso atual.";
      default:
        return "";
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Relatórios
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerador de Relatórios</DialogTitle>
          <DialogDescription>
            Configure e exporte relatórios relacionados às promoções dos militares.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tipo de Relatório */}
          <Card>
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium">Tipo de Relatório</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <RadioGroup 
                value={tipoRelatorio} 
                onValueChange={setTipoRelatorio}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="elegiveis" id="elegiveis" />
                  <Label htmlFor="elegiveis" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cbmepi-purple" /> Militares Elegíveis
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="merecimento" id="merecimento" />
                  <Label htmlFor="merecimento" className="flex items-center gap-2">
                    <FilePlus className="h-4 w-4 text-cbmepi-purple" /> Quadro de Merecimento
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="antiguidade" id="antiguidade" />
                  <Label htmlFor="antiguidade" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-cbmepi-purple" /> Quadro por Antiguidade
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quadro-acesso" id="quadro-acesso" />
                  <Label htmlFor="quadro-acesso" className="flex items-center gap-2">
                    <FileExport className="h-4 w-4 text-cbmepi-purple" /> Quadro de Acesso
                  </Label>
                </div>
              </RadioGroup>
              
              <p className="text-sm text-gray-500 mt-3">{getDescricaoRelatorio()}</p>
            </CardContent>
          </Card>
          
          {/* Filtros */}
          <Card>
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filtroQuadro">Filtrar por Quadro</Label>
                  <Select value={filtroQuadro} onValueChange={setFiltroQuadro}>
                    <SelectTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="filtroPosto">Filtrar por Posto</Label>
                  <Select value={filtroPosto} onValueChange={setFiltroPosto}>
                    <SelectTrigger>
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
            </CardContent>
          </Card>
          
          {/* Campos do Relatório */}
          <Card>
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium">Campos do Relatório</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="nomeCompleto" 
                    checked={camposSelecionados.nomeCompleto} 
                    onCheckedChange={() => toggleCampo("nomeCompleto")}
                  />
                  <label htmlFor="nomeCompleto" className="text-sm cursor-pointer">
                    Nome Completo
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="posto" 
                    checked={camposSelecionados.posto} 
                    onCheckedChange={() => toggleCampo("posto")}
                  />
                  <label htmlFor="posto" className="text-sm cursor-pointer">
                    Posto/Graduação
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="quadro" 
                    checked={camposSelecionados.quadro} 
                    onCheckedChange={() => toggleCampo("quadro")}
                  />
                  <label htmlFor="quadro" className="text-sm cursor-pointer">
                    Quadro
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dataUltimaPromocao" 
                    checked={camposSelecionados.dataUltimaPromocao} 
                    onCheckedChange={() => toggleCampo("dataUltimaPromocao")}
                  />
                  <label htmlFor="dataUltimaPromocao" className="text-sm cursor-pointer">
                    Data Última Promoção
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tempoServico" 
                    checked={camposSelecionados.tempoServico} 
                    onCheckedChange={() => toggleCampo("tempoServico")}
                  />
                  <label htmlFor="tempoServico" className="text-sm cursor-pointer">
                    Tempo de Serviço
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="criterio" 
                    checked={camposSelecionados.criterio} 
                    onCheckedChange={() => toggleCampo("criterio")}
                  />
                  <label htmlFor="criterio" className="text-sm cursor-pointer">
                    Critério de Promoção
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="proximoPosto" 
                    checked={camposSelecionados.proximoPosto} 
                    onCheckedChange={() => toggleCampo("proximoPosto")}
                  />
                  <label htmlFor="proximoPosto" className="text-sm cursor-pointer">
                    Próximo Posto
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pontuacao" 
                    checked={camposSelecionados.pontuacao} 
                    onCheckedChange={() => toggleCampo("pontuacao")}
                  />
                  <label htmlFor="pontuacao" className="text-sm cursor-pointer">
                    Pontuação
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Formato de Exportação */}
          <Card>
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium">Formato de Exportação</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <RadioGroup 
                value={formatoExportacao} 
                onValueChange={setFormatoExportacao}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" /> PDF
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" /> CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-blue-500" /> Excel
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-2" />
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-sm font-medium">Prévia do Relatório</div>
          <div className="text-sm text-gray-600 mt-1">
            {filtrarMilitares().length} militares incluídos
            {filtroQuadro !== "todos" ? ` (Quadro: ${filtroQuadro})` : ''}
            {filtroPosto !== "todos" ? ` (Posto: ${filtroPosto})` : ''}
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={gerarRelatorio} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Gerar e Baixar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
