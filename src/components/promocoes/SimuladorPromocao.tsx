
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Award, FileText } from "lucide-react";
import { Militar, PostoPatente } from "@/types";
import { format, addMonths, parseISO, differenceInMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SimuladorPromocaoProps {
  militar: Militar;
  pontuacaoAtual: number;
}

export const SimuladorPromocao = ({ militar, pontuacaoAtual }: SimuladorPromocaoProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pontuacao");
  
  // Estado para o simulador de pontuação
  const [pontuacaoSimulada, setPontuacaoSimulada] = useState(pontuacaoAtual);
  const [cursosMilitares, setCursosMilitares] = useState(0);
  const [cursosCivis, setCursosCivis] = useState(0);
  const [condecoracoes, setCondecoracoes] = useState(0);
  const [elogios, setElogios] = useState(0);
  const [mesesAdicionais, setMesesAdicionais] = useState(0);
  
  // Estado para o simulador de tempo
  const [tempoAdicional, setTempoAdicional] = useState(0);
  
  // Calcular promoção por tempo
  const calcularDataProximaPromocao = () => {
    if (!militar.dataUltimaPromocao) return "Sem registro da última promoção";
    
    try {
      const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
      let tempoNecessario = 0;
      
      // Obter tempo mínimo necessário para promoção conforme o posto
      switch (militar.posto) {
        case "2º Tenente": tempoNecessario = 36; break;
        case "1º Tenente": tempoNecessario = 48; break;
        case "Capitão": tempoNecessario = 48; break;
        case "Major": tempoNecessario = 48; break;
        case "Tenente-Coronel": tempoNecessario = 36; break;
        case "Soldado": tempoNecessario = 24; break;
        case "Cabo": tempoNecessario = 36; break;
        case "3º Sargento": tempoNecessario = 48; break;
        case "2º Sargento": tempoNecessario = 48; break;
        case "1º Sargento": tempoNecessario = 36; break;
        default: return "Posto não elegível para promoção";
      }
      
      // Calcular data mínima
      const dataProximaPromocao = addMonths(dataUltimaPromocao, tempoNecessario);
      
      // Formatar para exibição
      return format(dataProximaPromocao, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao calcular data de promoção:", error);
      return "Erro ao calcular data";
    }
  };
  
  // Calcular data com tempo adicional simulado
  const calcularDataComTempoAdicional = () => {
    if (!militar.dataUltimaPromocao) return "Sem registro da última promoção";
    
    try {
      const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
      let tempoNecessario = 0;
      
      // Obter tempo mínimo necessário para promoção conforme o posto
      switch (militar.posto) {
        case "2º Tenente": tempoNecessario = 36; break;
        case "1º Tenente": tempoNecessario = 48; break;
        case "Capitão": tempoNecessario = 48; break;
        case "Major": tempoNecessario = 48; break;
        case "Tenente-Coronel": tempoNecessario = 36; break;
        case "Soldado": tempoNecessario = 24; break;
        case "Cabo": tempoNecessario = 36; break;
        case "3º Sargento": tempoNecessario = 48; break;
        case "2º Sargento": tempoNecessario = 48; break;
        case "1º Sargento": tempoNecessario = 36; break;
        default: return "Posto não elegível para promoção";
      }
      
      // Calcular data com tempo reduzido (tempo necessário - tempo adicional simulado)
      const tempoFinal = Math.max(0, tempoNecessario - tempoAdicional);
      const dataProximaPromocao = addMonths(dataUltimaPromocao, tempoFinal);
      
      // Formatar para exibição
      return format(dataProximaPromocao, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao calcular data de promoção simulada:", error);
      return "Erro ao calcular data";
    }
  };
  
  // Calcular tempo desde a última promoção
  const calcularTempoDesdeUltimaPromocao = () => {
    if (!militar.dataUltimaPromocao) return "Sem registro";
    
    try {
      const dataPromocao = parseISO(militar.dataUltimaPromocao);
      const hoje = new Date();
      
      // Calcular diferença em meses
      return differenceInMonths(hoje, dataPromocao);
    } catch (error) {
      return 0;
    }
  };
  
  // Obter próximo posto
  const getProximoPosto = (posto: PostoPatente): string => {
    const postos: PostoPatente[] = [
      "Soldado",
      "Cabo",
      "3º Sargento",
      "2º Sargento",
      "1º Sargento",
      "Subtenente",
      "2º Tenente",
      "1º Tenente",
      "Capitão",
      "Major",
      "Tenente-Coronel",
      "Coronel",
    ];
    
    const index = postos.indexOf(posto);
    if (index === -1 || index === postos.length - 1) return "Posto máximo";
    
    return postos[index + 1];
  };
  
  // Atualizar pontuação simulada quando os valores mudarem
  React.useEffect(() => {
    const novaPontuacao = pontuacaoAtual + 
      (cursosMilitares * 0.5) + 
      (cursosCivis * 1.0) + 
      (condecoracoes * 0.5) + 
      (elogios * 0.2) +
      (mesesAdicionais * 0.1);
      
    setPontuacaoSimulada(novaPontuacao);
  }, [pontuacaoAtual, cursosMilitares, cursosCivis, condecoracoes, elogios, mesesAdicionais]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" /> Simulador de Promoção
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Simulador de Promoção - {militar.nomeGuerra}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="pontuacao" className="flex items-center gap-2">
              <Award className="h-4 w-4" /> Pontuação
            </TabsTrigger>
            <TabsTrigger value="tempo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Tempo
            </TabsTrigger>
          </TabsList>
          
          {/* Simulador de Pontuação */}
          <TabsContent value="pontuacao" className="space-y-4 pt-4">
            <div className="bg-muted/50 rounded-md p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Pontuação Atual</h3>
                  <p className="text-sm text-muted-foreground">Conforme ficha de conceito</p>
                </div>
                <Badge variant="outline" className="text-lg font-bold">{pontuacaoAtual.toFixed(1)}</Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Pontuação Simulada</h3>
                  <p className="text-sm text-muted-foreground">Com adições abaixo</p>
                </div>
                <Badge className="text-lg font-bold bg-green-500">{pontuacaoSimulada.toFixed(1)}</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cursos-militares">Cursos Militares Adicionais</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="cursos-militares"
                    min={0}
                    max={10}
                    step={1}
                    value={[cursosMilitares]}
                    onValueChange={(values) => setCursosMilitares(values[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{cursosMilitares}</div>
                </div>
                <p className="text-sm text-muted-foreground">Valor: +{(cursosMilitares * 0.5).toFixed(1)} pontos</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cursos-civis">Cursos Civis Adicionais</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="cursos-civis"
                    min={0}
                    max={5}
                    step={1}
                    value={[cursosCivis]}
                    onValueChange={(values) => setCursosCivis(values[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{cursosCivis}</div>
                </div>
                <p className="text-sm text-muted-foreground">Valor: +{(cursosCivis * 1.0).toFixed(1)} pontos</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condecoracoes">Condecorações Adicionais</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="condecoracoes"
                    min={0}
                    max={10}
                    step={1}
                    value={[condecoracoes]}
                    onValueChange={(values) => setCondecoracoes(values[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{condecoracoes}</div>
                </div>
                <p className="text-sm text-muted-foreground">Valor: +{(condecoracoes * 0.5).toFixed(1)} pontos</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="elogios">Elogios Adicionais</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="elogios"
                    min={0}
                    max={20}
                    step={1}
                    value={[elogios]}
                    onValueChange={(values) => setElogios(values[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{elogios}</div>
                </div>
                <p className="text-sm text-muted-foreground">Valor: +{(elogios * 0.2).toFixed(1)} pontos</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meses-servico">Meses de Serviço Adicionais</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="meses-servico"
                    min={0}
                    max={60}
                    step={1}
                    value={[mesesAdicionais]}
                    onValueChange={(values) => setMesesAdicionais(values[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{mesesAdicionais}</div>
                </div>
                <p className="text-sm text-muted-foreground">Valor: +{(mesesAdicionais * 0.1).toFixed(1)} pontos</p>
              </div>
            </div>
          </TabsContent>
          
          {/* Simulador de Tempo */}
          <TabsContent value="tempo" className="space-y-4 pt-4">
            <div className="bg-muted/50 rounded-md p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Posto Atual</h3>
                  <Badge variant="outline" className="mt-1">{militar.posto}</Badge>
                </div>
                <div>
                  <h3 className="font-medium">Próximo Posto</h3>
                  <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                    {getProximoPosto(militar.posto)}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium">Tempo no Posto</h3>
                  <p className="text-lg font-bold">{calcularTempoDesdeUltimaPromocao()} meses</p>
                </div>
                <div>
                  <h3 className="font-medium">Data Mínima para Promoção</h3>
                  <p className="text-lg font-bold">{calcularDataProximaPromocao()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tempo-adicional">Tempo Adicional (meses)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="tempo-adicional"
                    min={0}
                    max={48}
                    step={1}
                    value={[tempoAdicional]}
                    onValueChange={(values) => setTempoAdicional(values[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{tempoAdicional}</div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-medium text-green-800">Data Simulada para Promoção</h3>
                <p className="text-lg font-bold">{calcularDataComTempoAdicional()}</p>
                <p className="text-sm text-green-600 mt-1">
                  {tempoAdicional > 0 ? `Antecipação de ${tempoAdicional} meses` : "Sem antecipação"}
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Observação</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta é apenas uma simulação. A promoção real depende do cumprimento de todos os requisitos legais,
                  incluindo tempo mínimo no posto, pontuação suficiente e disponibilidade de vagas no Quadro de Fixação de Vagas (QFV).
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
