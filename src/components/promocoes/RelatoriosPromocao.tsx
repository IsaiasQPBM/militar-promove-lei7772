
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileChart, Download, ChevronDown } from "lucide-react";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Militar, QuadroMilitar, PostoPatente } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { ptBR } from 'date-fns/locale';

// Tipos de relatórios
type TipoRelatorio = 
  | "elegiveisAnterior" 
  | "elegiveisMerecimento"
  | "elegiveisMeritoIntelectual"
  | "quadroAcessoAnterior" 
  | "quadroAcessoMerecimento"
  | "antiguidade" 
  | "pendencias";

interface RelatoriosPromocaoProps {
  quadros: QuadroMilitar[];
}

const RelatoriosPromocao: React.FC<RelatoriosPromocaoProps> = ({ quadros }) => {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("elegiveisAnterior");
  const [quadroSelecionado, setQuadroSelecionado] = useState<QuadroMilitar | "">("");
  const [postoSelecionado, setPostoSelecionado] = useState<PostoPatente | "">("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Função para buscar os dados do relatório
  const buscarDadosRelatorio = async () => {
    if (!quadroSelecionado) {
      toast({
        title: "Quadro não selecionado",
        description: "Por favor, selecione um quadro para gerar o relatório.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      let query = supabase
        .from('militares')
        .select(`
          *,
          fichas_conceito(totalpontos, temposervicoquadro),
          promocoes(*)
        `)
        .eq('quadro', quadroSelecionado);
        
      // Aplicar filtro por posto se selecionado
      if (postoSelecionado) {
        query = query.eq('posto', postoSelecionado);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Processar os dados conforme o tipo de relatório
      let dadosProcessados = [];
      
      switch (tipoRelatorio) {
        case "elegiveisAnterior":
          dadosProcessados = processarElegiveisAnterior(data);
          break;
        case "elegiveisMerecimento":
          dadosProcessados = processarElegiveisMerecimento(data);
          break;
        case "elegiveisMeritoIntelectual":
          dadosProcessados = processarElegiveisMeritoIntelectual(data);
          break;
        case "quadroAcessoAnterior":
          dadosProcessados = processarQuadroAcessoAnterior(data);
          break;
        case "quadroAcessoMerecimento":
          dadosProcessados = processarQuadroAcessoMerecimento(data);
          break;
        case "antiguidade":
          dadosProcessados = processarAntiguidade(data);
          break;
        case "pendencias":
          dadosProcessados = processarPendencias(data);
          break;
        default:
          dadosProcessados = data;
      }
      
      setResultados(dadosProcessados);
    } catch (error) {
      console.error("Erro ao buscar dados para relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível buscar os dados necessários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Funções de processamento para cada tipo de relatório
  const processarElegiveisAnterior = (data: any[]) => {
    // Filtrar militares elegíveis por antiguidade
    return data
      .filter(militar => {
        // Verificar tempo mínimo no posto
        const tempoServicoQuadro = militar.fichas_conceito?.[0]?.temposervicoquadro || 0;
        const tempoMinimo = getTempoMinimoNoPosto(militar.posto);
        return tempoServicoQuadro >= tempoMinimo;
      })
      .sort((a, b) => {
        // Ordenar por tempo de serviço (descendente)
        const tempoA = a.fichas_conceito?.[0]?.temposervicoquadro || 0;
        const tempoB = b.fichas_conceito?.[0]?.temposervicoquadro || 0;
        return tempoB - tempoA;
      });
  };

  const processarElegiveisMerecimento = (data: any[]) => {
    // Filtrar militares com pontuação suficiente para promoção por merecimento
    return data
      .filter(militar => {
        const pontos = militar.fichas_conceito?.[0]?.totalpontos || 0;
        const pontuacaoMinima = getPontuacaoMinima(militar.posto);
        return pontos >= pontuacaoMinima;
      })
      .sort((a, b) => {
        // Ordenar por pontuação (descendente)
        const pontosA = a.fichas_conceito?.[0]?.totalpontos || 0;
        const pontosB = b.fichas_conceito?.[0]?.totalpontos || 0;
        return pontosB - pontosA;
      });
  };

  const processarElegiveisMeritoIntelectual = (data: any[]) => {
    // Filtrar militares por mérito intelectual (critérios acadêmicos)
    return data
      .filter(militar => {
        // Aqui seria necessário ter a lógica para verificar mérito intelectual
        // Baseado nos cursos e formações do militar
        const pontos = militar.fichas_conceito?.[0]?.totalpontos || 0;
        return pontos > 0; // Temporário, substituir por lógica real
      })
      .sort((a, b) => {
        // Ordenar por pontuação (descendente)
        const pontosA = a.fichas_conceito?.[0]?.totalpontos || 0;
        const pontosB = b.fichas_conceito?.[0]?.totalpontos || 0;
        return pontosB - pontosA;
      });
  };

  const processarQuadroAcessoAnterior = (data: any[]) => {
    // Gerar quadro de acesso por antiguidade
    return data
      .filter(militar => {
        // Filtrar militares aptos
        const tempoServicoQuadro = militar.fichas_conceito?.[0]?.temposervicoquadro || 0;
        const tempoMinimo = getTempoMinimoNoPosto(militar.posto);
        return tempoServicoQuadro >= tempoMinimo && militar.situacao === "ativo";
      })
      .sort((a, b) => {
        // Ordenar por tempo de serviço (descendente)
        const tempoA = a.fichas_conceito?.[0]?.temposervicoquadro || 0;
        const tempoB = b.fichas_conceito?.[0]?.temposervicoquadro || 0;
        if (tempoA !== tempoB) return tempoB - tempoA;
        
        // Desempate por data de inclusão
        return new Date(a.dataInclusao || 0).getTime() - new Date(b.dataInclusao || 0).getTime();
      });
  };

  const processarQuadroAcessoMerecimento = (data: any[]) => {
    // Gerar quadro de acesso por merecimento
    return data
      .filter(militar => {
        // Filtrar militares aptos
        const pontos = militar.fichas_conceito?.[0]?.totalpontos || 0;
        const pontuacaoMinima = getPontuacaoMinima(militar.posto);
        return pontos >= pontuacaoMinima && militar.situacao === "ativo";
      })
      .sort((a, b) => {
        // Ordenar por pontuação (descendente)
        const pontosA = a.fichas_conceito?.[0]?.totalpontos || 0;
        const pontosB = b.fichas_conceito?.[0]?.totalpontos || 0;
        return pontosB - pontosA;
      });
  };

  const processarAntiguidade = (data: any[]) => {
    // Gerar lista de antiguidade
    return data
      .filter(militar => militar.situacao === "ativo")
      .sort((a, b) => {
        // Ordenar por posto (decrescente - de Coronel a Soldado)
        const ordemPostos = [
          "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
          "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
        ];
        
        const postoIndexA = ordemPostos.indexOf(a.posto);
        const postoIndexB = ordemPostos.indexOf(b.posto);
        
        if (postoIndexA !== postoIndexB) return postoIndexA - postoIndexB;
        
        // Desempate por tempo de serviço
        const tempoA = a.fichas_conceito?.[0]?.temposervicoquadro || 0;
        const tempoB = b.fichas_conceito?.[0]?.temposervicoquadro || 0;
        return tempoB - tempoA;
      });
  };

  const processarPendencias = (data: any[]) => {
    // Listar militares com pendências (falta de documentos, cursos, etc)
    return data.filter(militar => {
      // Implementar lógica para identificar pendências
      // Por exemplo, cursos obrigatórios não realizados
      const pontos = militar.fichas_conceito?.[0]?.totalpontos || 0;
      const tempoServicoQuadro = militar.fichas_conceito?.[0]?.temposervicoquadro || 0;
      
      const tempoMinimo = getTempoMinimoNoPosto(militar.posto);
      const pontuacaoMinima = getPontuacaoMinima(militar.posto);
      
      // Se tem tempo mas não tem pontuação suficiente = pendência
      return tempoServicoQuadro >= tempoMinimo && pontos < pontuacaoMinima;
    });
  };

  // Funções auxiliares
  const getTempoMinimoNoPosto = (posto: string): number => {
    // Retorna o tempo mínimo em meses para cada posto
    const temposMinimos: Record<string, number> = {
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

  const getPontuacaoMinima = (posto: string): number => {
    // Retorna a pontuação mínima necessária para cada posto
    const pontuacoesMinimas: Record<string, number> = {
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

  // Função para exportar para CSV
  const exportarCSV = () => {
    // Gerar headers do CSV
    let headers = ["Nome", "Posto", "Quadro"];
    
    switch (tipoRelatorio) {
      case "elegiveisAnterior":
      case "quadroAcessoAnterior":
        headers.push("Tempo no Posto (meses)");
        break;
      case "elegiveisMerecimento":
      case "elegiveisMeritoIntelectual":
      case "quadroAcessoMerecimento":
        headers.push("Pontuação");
        break;
      case "pendencias":
        headers.push("Pendências");
        break;
    }
    
    // Gerar linhas do CSV
    const linhas = resultados.map(militar => {
      let linha = [
        militar.nome,
        militar.posto,
        militar.quadro
      ];
      
      switch (tipoRelatorio) {
        case "elegiveisAnterior":
        case "quadroAcessoAnterior":
          linha.push((militar.fichas_conceito?.[0]?.temposervicoquadro || 0).toString());
          break;
        case "elegiveisMerecimento":
        case "elegiveisMeritoIntelectual":
        case "quadroAcessoMerecimento":
          linha.push((militar.fichas_conceito?.[0]?.totalpontos || 0).toString());
          break;
        case "pendencias":
          linha.push("Pendências diversas"); // Substituir pela lógica real
          break;
      }
      
      return linha;
    });
    
    // Juntar headers e linhas
    const csvContent = [
      headers.join(","),
      ...linhas.map(l => l.join(","))
    ].join("\n");
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-${tipoRelatorio}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Relatório Exportado",
      description: "O relatório CSV foi gerado com sucesso!"
    });
  };

  // Função para exportar para PDF (simulado)
  const exportarPDF = () => {
    toast({
      title: "Exportação para PDF",
      description: "Esta funcionalidade será implementada em breve.",
      variant: "default"
    });
  };

  const handleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === resultados.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(resultados.map(item => item.id));
    }
  };

  // Renderizar colunas específicas com base no tipo de relatório
  const renderColunasDinamicas = () => {
    switch (tipoRelatorio) {
      case "elegiveisAnterior":
      case "quadroAcessoAnterior":
        return (
          <TableCell className="text-center">
            Tempo no Posto (meses)
          </TableCell>
        );
      case "elegiveisMerecimento":
      case "elegiveisMeritoIntelectual":
      case "quadroAcessoMerecimento":
        return (
          <TableCell className="text-center">
            Pontuação
          </TableCell>
        );
      case "pendencias":
        return (
          <TableCell className="text-center">
            Pendências
          </TableCell>
        );
      default:
        return null;
    }
  };

  const renderValorDinamico = (militar: any) => {
    switch (tipoRelatorio) {
      case "elegiveisAnterior":
      case "quadroAcessoAnterior":
        return (
          <TableCell className="text-center">
            {militar.fichas_conceito?.[0]?.temposervicoquadro || 0}
          </TableCell>
        );
      case "elegiveisMerecimento":
      case "elegiveisMeritoIntelectual":
      case "quadroAcessoMerecimento":
        return (
          <TableCell className="text-center">
            {militar.fichas_conceito?.[0]?.totalpontos?.toFixed(2) || "0.00"}
          </TableCell>
        );
      case "pendencias":
        return (
          <TableCell className="text-center">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Pontuação insuficiente
            </Badge>
          </TableCell>
        );
      default:
        return null;
    }
  };

  const getTituloRelatorio = () => {
    switch (tipoRelatorio) {
      case "elegiveisAnterior": return "Militares Elegíveis para Promoção por Antiguidade";
      case "elegiveisMerecimento": return "Militares Elegíveis para Promoção por Merecimento";
      case "elegiveisMeritoIntelectual": return "Militares Elegíveis por Mérito Intelectual";
      case "quadroAcessoAnterior": return "Quadro de Acesso por Antiguidade";
      case "quadroAcessoMerecimento": return "Quadro de Acesso por Merecimento";
      case "antiguidade": return "Lista de Antiguidade";
      case "pendencias": return "Militares com Pendências para Promoção";
      default: return "Relatório";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileChart className="mr-2 h-5 w-5" />
          Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Relatório
              </label>
              <Select 
                value={tipoRelatorio} 
                onValueChange={(value: TipoRelatorio) => setTipoRelatorio(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elegiveisAnterior">Elegíveis por Antiguidade</SelectItem>
                  <SelectItem value="elegiveisMerecimento">Elegíveis por Merecimento</SelectItem>
                  <SelectItem value="elegiveisMeritoIntelectual">Elegíveis por Mérito Intelectual</SelectItem>
                  <SelectItem value="quadroAcessoAnterior">Quadro de Acesso por Antiguidade</SelectItem>
                  <SelectItem value="quadroAcessoMerecimento">Quadro de Acesso por Merecimento</SelectItem>
                  <SelectItem value="antiguidade">Lista de Antiguidade</SelectItem>
                  <SelectItem value="pendencias">Militares com Pendências</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Quadro
              </label>
              <Select
                value={quadroSelecionado}
                onValueChange={(value: string) => setQuadroSelecionado(value as QuadroMilitar)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o quadro" />
                </SelectTrigger>
                <SelectContent>
                  {quadros.map((quadro) => (
                    <SelectItem key={quadro} value={quadro}>
                      {quadro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Posto/Graduação (opcional)
              </label>
              <Select
                value={postoSelecionado}
                onValueChange={(value: string) => setPostoSelecionado(value as PostoPatente)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
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
          
          <Button
            onClick={buscarDadosRelatorio}
            disabled={loading || !quadroSelecionado}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Relatório"
            )}
          </Button>
          
          {resultados.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {getTituloRelatorio()} ({resultados.length})
                </h3>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportarCSV}>
                        Exportar para CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportarPDF}>
                        Exportar para PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRows.length === resultados.length && resultados.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Posto</TableHead>
                      <TableHead>Quadro</TableHead>
                      {renderColunasDinamicas()}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((militar) => (
                      <TableRow key={militar.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(militar.id)}
                            onCheckedChange={() => handleRowSelection(militar.id)}
                            aria-label={`Select ${militar.nome}`}
                          />
                        </TableCell>
                        <TableCell>{militar.nome}</TableCell>
                        <TableCell>{militar.posto}</TableCell>
                        <TableCell>{militar.quadro}</TableCell>
                        {renderValorDinamico(militar)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-sm text-gray-500">
                Data de geração: {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosPromocao;
