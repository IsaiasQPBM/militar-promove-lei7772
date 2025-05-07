
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { PostoPatente, QuadroMilitar } from '@/types';
import { getCriteriosPromocao } from '@/services/promocaoService';
import { Check, X } from 'lucide-react';

interface SimuladorPromocaoProps {
  quadroSelecionado: QuadroMilitar;
}

const SimuladorPromocao: React.FC<SimuladorPromocaoProps> = ({ quadroSelecionado }) => {
  const [posto, setPosto] = useState<PostoPatente | "">("");
  const [criterios, setCriterios] = useState<string[]>([]);
  const [criteriosCumpridos, setCriteriosCumpridos] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [tempoServico, setTempoServico] = useState<number>(0);
  const [possuiCurso, setPossuiCurso] = useState<boolean>(false);
  const [apto, setApto] = useState<boolean>(false);
  const [conceito, setConceito] = useState<boolean>(false);
  const [pontuacao, setPontuacao] = useState<number>(0);
  
  // Simular promoção
  const simularPromocao = () => {
    if (!posto) return;
    
    // Obter critérios para o posto selecionado
    const criteriosPromocao = getCriteriosPromocao(posto, quadroSelecionado);
    setCriterios(criteriosPromocao);
    
    // Lógica simplificada para verificar elegibilidade
    const tempoMinimo = getTempoMinimoPosto(posto);
    const pontuacaoMinima = getPontuacaoMinima(posto);
    
    // Verificar critérios cumpridos
    const critCumpridos: string[] = [];
    
    // Verificar tempo de serviço
    if (tempoServico >= tempoMinimo) {
      critCumpridos.push(`Tempo mínimo de serviço (${tempoMinimo} meses)`);
    }
    
    // Verificar curso
    if (possuiCurso) {
      critCumpridos.push("Curso obrigatório concluído");
    }
    
    // Verificar aptidão
    if (apto) {
      critCumpridos.push("Aptidão física comprovada");
    }
    
    // Verificar conceito
    if (conceito) {
      critCumpridos.push("Conceito profissional e moral favorável");
    }
    
    // Verificar pontuação (para merecimento)
    if (pontuacao >= pontuacaoMinima) {
      critCumpridos.push(`Pontuação mínima (${pontuacaoMinima} pontos)`);
    }
    
    setCriteriosCumpridos(critCumpridos);
    setShowResults(true);
  };
  
  const getTempoMinimoPosto = (posto: PostoPatente): number => {
    // Retorna o tempo mínimo em meses para cada posto
    const temposMinimos: Record<PostoPatente, number> = {
      "Coronel": 0, // Posto máximo
      "Tenente-Coronel": 36, // 3 anos
      "Major": 48, // 4 anos
      "Capitão": 48, // 4 anos
      "1º Tenente": 48, // 4 anos
      "2º Tenente": 36, // 3 anos
      "Subtenente": 0, // Graduação máxima para praças
      "1º Sargento": 36, // 3 anos
      "2º Sargento": 48, // 4 anos
      "3º Sargento": 48, // 4 anos
      "Cabo": 36, // 3 anos
      "Soldado": 24 // 2 anos
    };
    
    return temposMinimos[posto] || 0;
  };

  const getPontuacaoMinima = (posto: PostoPatente): number => {
    // Retorna a pontuação mínima necessária para cada posto
    const pontuacoesMinimas: Record<PostoPatente, number> = {
      "Coronel": 0, // Posto máximo
      "Tenente-Coronel": 15,
      "Major": 12,
      "Capitão": 10,
      "1º Tenente": 7,
      "2º Tenente": 5,
      "Subtenente": 0, // Graduação máxima para praças
      "1º Sargento": 7,
      "2º Sargento": 5,
      "3º Sargento": 4,
      "Cabo": 3,
      "Soldado": 2
    };
    
    return pontuacoesMinimas[posto] || 0;
  };
  
  const getProximoPosto = (postoAtual: PostoPatente): PostoPatente | null => {
    const sequencia: PostoPatente[] = [
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
      "Coronel"
    ];
    
    const indexAtual = sequencia.indexOf(postoAtual);
    if (indexAtual === -1 || indexAtual === sequencia.length - 1) return null;
    return sequencia[indexAtual + 1];
  };
  
  const postosMilitares: PostoPatente[] = [
    "Coronel",
    "Tenente-Coronel",
    "Major",
    "Capitão",
    "1º Tenente",
    "2º Tenente",
    "Subtenente",
    "1º Sargento",
    "2º Sargento",
    "3º Sargento",
    "Cabo",
    "Soldado"
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Simulador de Promoção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Posto Atual
              </label>
              <Select value={posto} onValueChange={(value) => setPosto(value as PostoPatente)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o posto" />
                </SelectTrigger>
                <SelectContent>
                  {postosMilitares.filter(p => 
                    (quadroSelecionado.startsWith('Q') && p.includes('Tenente')) || 
                    (quadroSelecionado === 'QPBM' && !p.includes('Tenente') && p !== 'Coronel') ||
                    (quadroSelecionado !== 'QPBM')
                  ).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Tempo de Serviço no Posto (meses)
              </label>
              <Input
                type="number"
                min="0"
                value={tempoServico}
                onChange={(e) => setTempoServico(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="possuiCurso"
                className="rounded border-gray-300"
                checked={possuiCurso}
                onChange={() => setPossuiCurso(!possuiCurso)}
              />
              <label htmlFor="possuiCurso" className="text-sm">
                Possui curso necessário
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="apto"
                className="rounded border-gray-300"
                checked={apto}
                onChange={() => setApto(!apto)}
              />
              <label htmlFor="apto" className="text-sm">
                Aptidão física
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="conceito"
                className="rounded border-gray-300"
                checked={conceito}
                onChange={() => setConceito(!conceito)}
              />
              <label htmlFor="conceito" className="text-sm">
                Conceito favorável
              </label>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <label htmlFor="pontuacao" className="text-sm">
                  Pontuação
                </label>
                <Input
                  id="pontuacao"
                  type="number"
                  min="0"
                  step="0.1"
                  value={pontuacao}
                  onChange={(e) => setPontuacao(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={simularPromocao} disabled={!posto}>
              Simular Promoção
            </Button>
          </div>
          
          {showResults && posto && (
            <div className="mt-6 border rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">
                Resultado da Simulação
              </h3>
              
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Posto atual:</strong> {posto}
                </p>
                <p className="mb-2">
                  <strong>Próxima promoção:</strong> {getProximoPosto(posto) || "Posto máximo alcançado"}
                </p>
                <p>
                  <strong>Critérios cumpridos:</strong> {criteriosCumpridos.length} de {criterios.length}
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Critério</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criterios.map((criterio, index) => {
                    const cumprido = criteriosCumpridos.some(c => criterio.includes(c));
                    return (
                      <TableRow key={index}>
                        <TableCell>{criterio}</TableCell>
                        <TableCell>
                          {cumprido ? (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-green-600">Cumprido</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <X className="h-4 w-4 text-red-600 mr-1" />
                              <span className="text-red-600">Pendente</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-4 p-3 rounded-md bg-gray-50">
                <p className="font-semibold">
                  Conclusão: {criteriosCumpridos.length === criterios.length ? (
                    <span className="text-green-600">Elegível para promoção</span>
                  ) : criteriosCumpridos.length >= criterios.length / 2 ? (
                    <span className="text-yellow-600">Parcialmente elegível</span>
                  ) : (
                    <span className="text-red-600">Não elegível</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimuladorPromocao;
