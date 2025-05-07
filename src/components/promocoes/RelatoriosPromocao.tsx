
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  FileText,   // Changed from FileChart to FileText
  UserCheck, 
  Clock, 
  Award, 
  Download 
} from "lucide-react";
import TabelaPromocoes from "@/components/TabelaPromocoes";
import { useQFVData } from "@/hooks/useQFVData";
import { toast } from "@/components/ui/use-toast";

interface RelatoriosPromocaoProps {
  quadros: string[];
}

const RelatoriosPromocao = ({ quadros }: RelatoriosPromocaoProps) => {
  const [tipoRelatorio, setTipoRelatorio] = useState("elegiveis");
  const [quadroSelecionado, setQuadroSelecionado] = useState(quadros[0] || "QOEM");
  const [criterioSelecionado, setCriterioSelecionado] = useState("Ambos");
  const { qfvData, loading } = useQFVData();

  // Função para gerar relatório (simulada)
  const gerarRelatorio = () => {
    toast({
      title: "Relatório Gerado",
      description: `Relatório de ${tipoRelatorio} para o quadro ${quadroSelecionado} gerado com sucesso.`
    });
  };

  // Função para exportar relatório (simulada)
  const exportarRelatorio = (formato: string) => {
    toast({
      title: `Exportando para ${formato}`,
      description: "O arquivo será baixado em instantes."
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="tipo-relatorio">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger id="tipo-relatorio" className="w-full">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elegiveis">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Militares Elegíveis para Promoção</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="antiguidade">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Lista de Antiguidade</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="merecimento">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Quadro de Acesso por Merecimento</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pendencias">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Militares com Pendências</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="quadro-relatorio">Quadro</Label>
              <Select value={quadroSelecionado} onValueChange={setQuadroSelecionado}>
                <SelectTrigger id="quadro-relatorio">
                  <SelectValue placeholder="Selecione o quadro" />
                </SelectTrigger>
                <SelectContent>
                  {quadros.map(quadro => (
                    <SelectItem key={quadro} value={quadro}>
                      {quadro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="criterio-relatorio">Critério (quando aplicável)</Label>
              <Select value={criterioSelecionado} onValueChange={setCriterioSelecionado}>
                <SelectTrigger id="criterio-relatorio">
                  <SelectValue placeholder="Selecione o critério" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambos">Todos os Critérios</SelectItem>
                  <SelectItem value="Antiguidade">Antiguidade</SelectItem>
                  <SelectItem value="Merecimento">Merecimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-none self-end">
              <Button onClick={gerarRelatorio}>
                Gerar Relatório
              </Button>
            </div>
          </div>
          
          {/* Conteúdo do Relatório */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Prévia do Relatório</h3>
            
            {/* Simulação de dados do relatório */}
            <div className="overflow-auto">
              {tipoRelatorio === "elegiveis" && (
                <TabelaPromocoes previsoes={[]} />
              )}
              
              {tipoRelatorio === "antiguidade" && (
                <p className="text-center p-4">Selecione um quadro e gere o relatório para visualizar a Lista de Antiguidade</p>
              )}
              
              {tipoRelatorio === "merecimento" && (
                <p className="text-center p-4">Selecione um quadro e gere o relatório para visualizar o Quadro de Acesso por Merecimento</p>
              )}
              
              {tipoRelatorio === "pendencias" && (
                <p className="text-center p-4">Selecione um quadro e gere o relatório para visualizar a Lista de Militares com Pendências</p>
              )}
            </div>
          </div>
          
          {/* Ações de Exportação */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => exportarRelatorio("CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={() => exportarRelatorio("PDF")}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosPromocao;
