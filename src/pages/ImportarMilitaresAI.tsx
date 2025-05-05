
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileCheck, AlertCircle, Download, Info } from "lucide-react";
import { uploadAndScanMilitares, ProcessedMilitarData } from "@/services/documentService";
import { createMilitar } from "@/services/militarService";
import { QuadroMilitar, PostoPatente, Sexo, TipoSanguineo } from "@/types";

const ImportarMilitaresAI = () => {
  const navigate = useNavigate();
  const [importarArquivo, setImportarArquivo] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedMilitarData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");
  const [importResults, setImportResults] = useState<{
    militarId: string;
    nome: string;
    status: "pending" | "processing" | "success" | "error";
    message?: string;
  }[]>([]);

  // Handler para o upload do arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith('.docx')) {
        setImportarArquivo(file);
      } else {
        toast({
          title: "Formato de arquivo inválido",
          description: "Por favor, selecione um arquivo PDF ou DOCX.",
          variant: "destructive"
        });
      }
    }
  };

  // Função para processar o arquivo
  const processFile = async () => {
    if (!importarArquivo) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para processar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Upload e escaneamento do arquivo
      const data = await uploadAndScanMilitares(importarArquivo);
      
      if (data) {
        setProcessedData(data);
        setActiveTab("resultados");
        
        // Preparar resultados de importação
        const results = data.militares.map(militar => ({
          militarId: crypto.randomUUID(),
          nome: militar.nome,
          status: "pending" as const
        }));
        
        setImportResults(results);
        
        toast({
          title: "Arquivo processado com sucesso!",
          description: `${data.totalMilitares} militares encontrados no arquivo.`,
        });
      }
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Não foi possível processar o arquivo selecionado.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para importar os militares
  const importarMilitares = async () => {
    if (!processedData || processedData.militares.length === 0) {
      toast({
        title: "Nenhum militar para importar",
        description: "Por favor, processe um arquivo com dados de militares.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    // Copiar o array para não modificar o estado diretamente
    const resultadosAtualizados = [...importResults];
    
    let contadorSucesso = 0;
    let contadorErro = 0;
    
    for (let i = 0; i < processedData.militares.length; i++) {
      try {
        // Atualiza o status para processando
        resultadosAtualizados[i] = { ...resultadosAtualizados[i], status: "processing" };
        setImportResults([...resultadosAtualizados]);
        
        // Calcula o progresso
        const progressoAtual = ((i + 1) / processedData.militares.length) * 100;
        setProgresso(progressoAtual);
        
        // Simula uma espera para visualizar o progresso
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const militar = processedData.militares[i];
        
        // Dados padrão para completar o registro
        const dataNascimento = new Date().toISOString().split('T')[0];
        const dataInclusao = new Date().toISOString().split('T')[0];
        const dataUltimaPromocao = new Date().toISOString().split('T')[0];
        
        // Chama a função de criação de militar
        await createMilitar({
          nomeCompleto: militar.nome,
          nomeGuerra: militar.nome.split(' ')[0],
          posto: militar.posto as PostoPatente,
          quadro: militar.quadro as QuadroMilitar,
          dataNascimento,
          dataInclusao,
          dataUltimaPromocao,
          situacao: militar.situacao as any,
          email: `${militar.nome.toLowerCase().replace(/\s+/g, '.')}@cbm.pi.gov.br`,
          foto: null,
          tipoSanguineo: "O+" as TipoSanguineo,
          sexo: "Masculino" as Sexo
        });
        
        // Atualiza o status para sucesso
        resultadosAtualizados[i] = { 
          ...resultadosAtualizados[i], 
          status: "success", 
          message: "Importado com sucesso" 
        };
        contadorSucesso++;
      } catch (error: any) {
        // Atualiza o status para erro
        resultadosAtualizados[i] = { 
          ...resultadosAtualizados[i], 
          status: "error", 
          message: error.message || "Erro ao importar militar" 
        };
        contadorErro++;
      } finally {
        setImportResults([...resultadosAtualizados]);
      }
    }
    
    setIsImporting(false);
    
    toast({
      title: "Importação concluída",
      description: `${contadorSucesso} militares importados com sucesso. ${contadorErro} erros.`,
      variant: contadorErro > 0 ? "destructive" : "default"
    });
  };

  // Renderiza o status do militar na tabela
  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-gray-500">Pendente</span>;
      case "processing":
        return <span className="text-blue-500">Processando...</span>;
      case "success":
        return <span className="text-green-500 flex items-center gap-1">
          <FileCheck size={16} /> Importado
        </span>;
      case "error":
        return <span className="text-red-500 flex items-center gap-1">
          <AlertCircle size={16} /> Erro
        </span>;
      default:
        return null;
    }
  };

  // Renderiza estatísticas de classificação
  const renderClassificacaoStats = () => {
    if (!processedData) return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {Object.entries(processedData.classificados).map(([quadro, count]) => (
          <Card key={quadro}>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium text-lg">{quadro}</h4>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm text-gray-500">militares</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Importação de Militares com IA</h1>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
        >
          Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Militares com IA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="upload">Upload e Processamento</TabsTrigger>
              <TabsTrigger value="resultados" disabled={!processedData}>Resultados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="pt-4 space-y-6">
              <div className="rounded-md border p-4 bg-amber-50">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-amber-800">Como funciona a importação com IA</h4>
                    <p className="text-sm text-amber-700">
                      Faça upload de um arquivo PDF ou DOCX contendo dados de militares. 
                      O sistema utilizará inteligência artificial para analisar o conteúdo, 
                      extrair informações e classificar cada militar de acordo com seu quadro e situação.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/modelo-documentos")}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Baixar modelo de documento
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <Upload size={16} />
                  Selecionar arquivo
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
              </div>
              
              {importarArquivo && (
                <div className="flex items-center gap-2 text-sm">
                  <FileCheck size={16} className="text-green-600" />
                  <span>{importarArquivo.name}</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={50} className="w-full" />
                  <p className="text-sm text-gray-500">Processando arquivo...</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  onClick={processFile}
                  disabled={!importarArquivo || isProcessing}
                  className="mt-4"
                >
                  {isProcessing ? "Processando..." : "Processar Arquivo"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="resultados" className="pt-4 space-y-6">
              {renderClassificacaoStats()}
              
              {importResults.length > 0 && (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome Completo</TableHead>
                          <TableHead>Posto</TableHead>
                          <TableHead>Quadro</TableHead>
                          <TableHead>Situação</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processedData?.militares.map((militar, index) => (
                          <TableRow key={index}>
                            <TableCell>{militar.nome}</TableCell>
                            <TableCell>{militar.posto}</TableCell>
                            <TableCell>{militar.quadro}</TableCell>
                            <TableCell>{militar.situacao}</TableCell>
                            <TableCell>{renderStatus(importResults[index]?.status || 'pending')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {isImporting && (
                    <div className="space-y-2">
                      <Progress value={progresso} className="w-full" />
                      <p className="text-sm text-gray-500">Importando militares... {Math.floor(progresso)}%</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={importarMilitares}
                      disabled={isImporting}
                      className="mt-4"
                    >
                      {isImporting ? "Importando..." : "Iniciar Importação"}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportarMilitaresAI;
