
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { CalendarPlus, FileText, Calculator, FileHeart } from "lucide-react";
import { format, addYears, parseISO, differenceInDays, differenceInMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Militar, PostoPatente } from "@/types";
import { tempoPromocoesOficiais, tempoPromocoesPracas } from "@/utils/promocaoUtils";
import { obterCriteriosLei5461 } from "@/services/promocaoService";

interface SimuladorPromocaoProps {
  militar: Militar;
  pontuacaoAtual?: number;
}

export const SimuladorPromocao: React.FC<SimuladorPromocaoProps> = ({ militar, pontuacaoAtual = 0 }) => {
  const [tempoAdicional, setTempoAdicional] = useState(0);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [condecoracaoSelecionada, setCondecoracaoSelecionada] = useState("");
  const [elogiosSelecionados, setElogiosSelecionados] = useState(0);
  const [pontuacaoSimulada, setPontuacaoSimulada] = useState(pontuacaoAtual);
  const [dataElegibilidade, setDataElegibilidade] = useState<Date | null>(null);
  const [proximoPosto, setProximoPosto] = useState<PostoPatente | null>(null);
  const [tempoRestante, setTempoRestante] = useState("");
  const [activeTab, setActiveTab] = useState("tempo");
  const criteriosLei = obterCriteriosLei5461();
  
  useEffect(() => {
    // Inicializar dados do simulador
    if (militar) {
      const isOficial = ["QOEM", "QOE", "QORR"].includes(militar.quadro);
      const tabela = isOficial ? tempoPromocoesOficiais : tempoPromocoesPracas;
      const infoPromocao = tabela[militar.posto];
      
      if (infoPromocao && infoPromocao.proximoPosto) {
        setProximoPosto(infoPromocao.proximoPosto);
        
        if (militar.dataUltimaPromocao) {
          const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
          const dataElegibilidadeBase = addYears(dataUltimaPromocao, infoPromocao.tempoMinimo);
          setDataElegibilidade(dataElegibilidadeBase);
          
          // Calcular tempo restante inicial
          calcularTempoRestante(dataElegibilidadeBase);
        }
      }
    }
  }, [militar]);
  
  // Recalcular sempre que os parâmetros mudarem
  useEffect(() => {
    if (militar.dataUltimaPromocao && proximoPosto) {
      // Simular nova data de elegibilidade com base no tempo adicional
      const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
      const isOficial = ["QOEM", "QOE", "QORR"].includes(militar.quadro);
      const tabela = isOficial ? tempoPromocoesOficiais : tempoPromocoesPracas;
      const infoPromocao = tabela[militar.posto];
      
      if (infoPromocao) {
        // Reduzir o tempo mínimo com base no tempo adicional (meses)
        const tempoMinimoAjustado = Math.max(0, infoPromocao.tempoMinimo * 12 - tempoAdicional);
        const anosAjustados = Math.floor(tempoMinimoAjustado / 12);
        const mesesAjustados = tempoMinimoAjustado % 12;
        
        // Calcular nova data de elegibilidade
        let novaData = addYears(dataUltimaPromocao, anosAjustados);
        novaData = new Date(novaData.setMonth(novaData.getMonth() + mesesAjustados));
        
        setDataElegibilidade(novaData);
        calcularTempoRestante(novaData);
      }
    }
    
    // Recalcular pontuação simulada
    let novaPontuacao = pontuacaoAtual;
    
    // Adicionar pontos de cursos
    if (cursoSelecionado === "especializacao") {
      novaPontuacao += criteriosLei.cursosMilitares.especializacao.pontuacao;
    } else if (cursoSelecionado === "cfo") {
      novaPontuacao += criteriosLei.cursosMilitares.cfo.pontuacao;
    } else if (cursoSelecionado === "cao") {
      novaPontuacao += criteriosLei.cursosMilitares.cao.pontuacao;
    } else if (cursoSelecionado === "superior") {
      novaPontuacao += criteriosLei.cursosCivis.superior.pontuacao;
    } else if (cursoSelecionado === "especializacao-civil") {
      novaPontuacao += criteriosLei.cursosCivis.especializacao.pontuacao;
    } else if (cursoSelecionado === "mestrado") {
      novaPontuacao += criteriosLei.cursosCivis.mestrado.pontuacao;
    } else if (cursoSelecionado === "doutorado") {
      novaPontuacao += criteriosLei.cursosCivis.doutorado.pontuacao;
    }
    
    // Adicionar pontos de condecorações
    if (condecoracaoSelecionada === "federal") {
      novaPontuacao += criteriosLei.condecoracoes.governoFederal.pontuacao;
    } else if (condecoracaoSelecionada === "estadual") {
      novaPontuacao += criteriosLei.condecoracoes.governoEstadual.pontuacao;
    } else if (condecoracaoSelecionada === "cbmepi") {
      novaPontuacao += criteriosLei.condecoracoes.cbmepi.pontuacao;
    }
    
    // Adicionar pontos de elogios
    novaPontuacao += elogiosSelecionados * criteriosLei.elogios.individual.pontuacao;
    
    setPontuacaoSimulada(novaPontuacao);
  }, [militar, tempoAdicional, cursoSelecionado, condecoracaoSelecionada, elogiosSelecionados, pontuacaoAtual, proximoPosto]);
  
  const calcularTempoRestante = (data: Date) => {
    const hoje = new Date();
    const diasRestantes = differenceInDays(data, hoje);
    const mesesRestantes = differenceInMonths(data, hoje);
    
    if (diasRestantes < 0) {
      setTempoRestante("Promoção disponível");
    } else if (mesesRestantes < 1) {
      setTempoRestante(`${diasRestantes} dias`);
    } else if (mesesRestantes < 12) {
      setTempoRestante(`${mesesRestantes} meses`);
    } else {
      const anos = Math.floor(mesesRestantes / 12);
      const mesesRestantesFinal = mesesRestantes % 12;
      setTempoRestante(`${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantesFinal} ${mesesRestantesFinal === 1 ? 'mês' : 'meses'}`);
    }
  };
  
  const resetarSimulacao = () => {
    setTempoAdicional(0);
    setCursoSelecionado("");
    setCondecoracaoSelecionada("");
    setElogiosSelecionados(0);
    
    // Restaurar valores iniciais
    if (militar && militar.dataUltimaPromocao) {
      const isOficial = ["QOEM", "QOE", "QORR"].includes(militar.quadro);
      const tabela = isOficial ? tempoPromocoesOficiais : tempoPromocoesPracas;
      const infoPromocao = tabela[militar.posto];
      
      if (infoPromocao) {
        const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
        const dataElegibilidadeBase = addYears(dataUltimaPromocao, infoPromocao.tempoMinimo);
        setDataElegibilidade(dataElegibilidadeBase);
        calcularTempoRestante(dataElegibilidadeBase);
      }
    }
    
    setPontuacaoSimulada(pontuacaoAtual);
    toast({
      title: "Simulação resetada",
      description: "Os valores foram restaurados para os dados atuais do militar."
    });
  };
  
  const gerarRelatorioSimulacao = () => {
    // Aqui poderíamos implementar a geração de um PDF ou CSV
    // Por enquanto, apenas exibimos um toast
    toast({
      title: "Simulação salva",
      description: "Um relatório desta simulação seria gerado e salvo."
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" /> Simulador de Promoção
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Simulador de Promoção e Pontuação</DialogTitle>
          <DialogDescription>
            Simule o impacto de cursos, condecorações e tempo de serviço na elegibilidade
            para promoção do militar {militar.nomeGuerra}.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="tempo">Tempo de Serviço</TabsTrigger>
            <TabsTrigger value="cursos">Cursos e Condecorações</TabsTrigger>
            <TabsTrigger value="resultado">Resultado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tempo" className="space-y-4">
            <Card>
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle className="text-sm font-medium">Tempo de Serviço Adicional</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tempoAdicional">Meses adicionais de serviço:</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="tempoAdicional"
                        type="number"
                        min="0"
                        max="60"
                        value={tempoAdicional}
                        onChange={(e) => setTempoAdicional(parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">meses</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Simule a adição de meses de serviço para antecipar a data de elegibilidade para promoção.
                    </p>
                  </div>
                  
                  {dataElegibilidade && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm font-medium">Data prevista para elegibilidade:</div>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarPlus className="h-4 w-4 text-cbmepi-purple" />
                        <span>
                          {format(dataElegibilidade, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Tempo restante: </span>
                        <span className={tempoRestante === "Promoção disponível" ? "text-green-600 font-medium" : ""}>
                          {tempoRestante}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cursos" className="space-y-4">
            <Card>
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle className="text-sm font-medium">Simulação de Cursos e Méritos</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="curso">Curso adicional:</Label>
                  <Select value={cursoSelecionado} onValueChange={setCursoSelecionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="">Nenhum</SelectItem>
                        <SelectItem value="especializacao">Curso de Especialização Militar (+0.5)</SelectItem>
                        <SelectItem value="cfo">Curso de Formação de Oficiais (+4.0)</SelectItem>
                        <SelectItem value="cao">Curso de Aperfeiçoamento de Oficiais (+3.0)</SelectItem>
                        <SelectItem value="superior">Curso Superior (+1.0)</SelectItem>
                        <SelectItem value="especializacao-civil">Especialização Civil (+1.0)</SelectItem>
                        <SelectItem value="mestrado">Mestrado (+2.0)</SelectItem>
                        <SelectItem value="doutorado">Doutorado (+3.0)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condecoracao">Condecoração adicional:</Label>
                  <Select value={condecoracaoSelecionada} onValueChange={setCondecoracaoSelecionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma condecoração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      <SelectItem value="federal">Condecoração Federal (+1.0)</SelectItem>
                      <SelectItem value="estadual">Condecoração Estadual (+0.5)</SelectItem>
                      <SelectItem value="cbmepi">Condecoração CBMEPI (+0.2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="elogios">Elogios individuais adicionais:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="elogios"
                      type="number"
                      min="0"
                      max="10"
                      value={elogiosSelecionados}
                      onChange={(e) => setElogiosSelecionados(parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">elogios (+0.2 cada)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resultado" className="space-y-4">
            <Card>
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle className="text-sm font-medium">Resultado da Simulação</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="text-sm text-gray-500">Pontuação atual</div>
                      <div className="text-2xl font-bold">{pontuacaoAtual.toFixed(1)}</div>
                    </div>
                    <div className="border rounded-md p-3 bg-cbmepi-purple text-white">
                      <div className="text-sm opacity-90">Pontuação simulada</div>
                      <div className="text-2xl font-bold">{pontuacaoSimulada.toFixed(1)}</div>
                      {pontuacaoSimulada > pontuacaoAtual && (
                        <div className="text-xs mt-1 bg-white/20 rounded px-2 py-0.5 inline-block">
                          +{(pontuacaoSimulada - pontuacaoAtual).toFixed(1)} pontos
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {dataElegibilidade && (
                    <div className="border rounded-md p-3">
                      <div className="text-sm font-medium mb-1">Impacto na promoção:</div>
                      <div className="flex items-center gap-2">
                        <CalendarPlus className="h-4 w-4 text-cbmepi-purple" />
                        <span>
                          {format(dataElegibilidade, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Tempo restante: </span>
                        <span className={tempoRestante === "Promoção disponível" ? "text-green-600 font-medium" : ""}>
                          {tempoRestante}
                        </span>
                      </div>
                      {proximoPosto && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Próximo posto: </span>
                          <span>{proximoPosto}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={resetarSimulacao} className="sm:mr-auto">
            Resetar Simulação
          </Button>
          <Button variant="outline" onClick={gerarRelatorioSimulacao} className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Gerar Relatório
          </Button>
          <Button onClick={() => toast({
            title: "Simulação concluída",
            description: "Você pode continuar ajustando os parâmetros para ver diferentes cenários."
          })}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
