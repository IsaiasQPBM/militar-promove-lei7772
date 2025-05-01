
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileCheck, AlertCircle, CheckCircle } from "lucide-react";
import { Militar, PostoPatente, QuadroMilitar, TipoSanguineo, Sexo } from "@/types";
import { createMilitar } from "@/services/militarService";

type MilitarImportData = {
  nomeCompleto: string;
  nomeGuerra: string;
  posto: PostoPatente;
  quadro: QuadroMilitar;
  dataNascimento: string;
  dataInclusao: string;
  dataUltimaPromocao: string;
  situacao: "ativo" | "inativo";
  email: string;
  tipoSanguineo: TipoSanguineo;
  sexo: Sexo;
  status?: "pendente" | "processando" | "sucesso" | "erro";
  mensagem?: string;
};

const ImportarMilitares = () => {
  const navigate = useNavigate();
  const [importarArquivo, setImportarArquivo] = useState<File | null>(null);
  const [militaresParaImportar, setMilitaresParaImportar] = useState<MilitarImportData[]>([]);
  const [importando, setImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  // Função para processar os dados do arquivo PDF
  const processarArquivoPDF = async (file: File) => {
    // Aqui normalmente teríamos uma biblioteca como pdf.js para processar o PDF
    // Como é uma simulação e o arquivo real não está acessível, vamos usar dados de exemplo
    
    // Dados de exemplo que simulariam o que seria extraído do PDF
    const dadosExtraidos: MilitarImportData[] = [
      {
        nomeCompleto: "José da Silva",
        nomeGuerra: "Silva",
        posto: "Major",
        quadro: "QOEM",
        dataNascimento: "1980-05-15",
        dataInclusao: "2000-03-01",
        dataUltimaPromocao: "2020-01-10",
        situacao: "ativo",
        email: "jose.silva@cbm.pi.gov.br",
        tipoSanguineo: "A+",
        sexo: "Masculino",
        status: "pendente"
      },
      {
        nomeCompleto: "Maria Oliveira",
        nomeGuerra: "Oliveira",
        posto: "Capitão",
        quadro: "QOE",
        dataNascimento: "1985-07-22",
        dataInclusao: "2005-06-15",
        dataUltimaPromocao: "2019-12-05",
        situacao: "ativo",
        email: "maria.oliveira@cbm.pi.gov.br",
        tipoSanguineo: "O-",
        sexo: "Feminino",
        status: "pendente"
      },
      {
        nomeCompleto: "Carlos Santos",
        nomeGuerra: "Santos",
        posto: "2º Tenente",
        quadro: "QOE",
        dataNascimento: "1990-03-08",
        dataInclusao: "2010-08-20",
        dataUltimaPromocao: "2021-05-18",
        situacao: "ativo",
        email: "carlos.santos@cbm.pi.gov.br",
        tipoSanguineo: "B+",
        sexo: "Masculino",
        status: "pendente"
      },
      {
        nomeCompleto: "Ana Pereira",
        nomeGuerra: "Pereira",
        posto: "1º Sargento",
        quadro: "QPBM",
        dataNascimento: "1988-11-12",
        dataInclusao: "2008-01-10",
        dataUltimaPromocao: "2018-09-30",
        situacao: "ativo",
        email: "ana.pereira@cbm.pi.gov.br",
        tipoSanguineo: "AB+",
        sexo: "Feminino",
        status: "pendente"
      },
      {
        nomeCompleto: "Roberto Lima",
        nomeGuerra: "Lima",
        posto: "Cabo",
        quadro: "QPBM",
        dataNascimento: "1992-09-25",
        dataInclusao: "2012-04-05",
        dataUltimaPromocao: "2022-02-15",
        situacao: "ativo",
        email: "roberto.lima@cbm.pi.gov.br",
        tipoSanguineo: "O+",
        sexo: "Masculino",
        status: "pendente"
      }
    ];

    setMilitaresParaImportar(dadosExtraidos);
    
    toast({
      title: "Arquivo processado com sucesso!",
      description: `${dadosExtraidos.length} militares encontrados no arquivo.`,
    });
  };

  // Handler para o upload do arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setImportarArquivo(file);
        processarArquivoPDF(file);
      } else {
        toast({
          title: "Formato de arquivo inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive"
        });
      }
    }
  };

  // Função para importar os militares
  const importarMilitares = async () => {
    if (militaresParaImportar.length === 0) {
      toast({
        title: "Nenhum militar para importar",
        description: "Por favor, selecione um arquivo com dados de militares.",
        variant: "destructive"
      });
      return;
    }

    setImportando(true);
    
    // Copiar o array para não modificar o estado diretamente
    const militaresAtualizados = [...militaresParaImportar];
    
    let contadorSucesso = 0;
    let contadorErro = 0;
    
    for (let i = 0; i < militaresAtualizados.length; i++) {
      try {
        // Atualiza o status para processando
        militaresAtualizados[i] = { ...militaresAtualizados[i], status: "processando" };
        setMilitaresParaImportar([...militaresAtualizados]);
        
        // Calcula o progresso
        const progressoAtual = ((i + 1) / militaresAtualizados.length) * 100;
        setProgresso(progressoAtual);
        
        // Simula uma espera para visualizar o progresso
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Chama a função de criação de militar
        await createMilitar({
          nomeCompleto: militaresAtualizados[i].nomeCompleto,
          nomeGuerra: militaresAtualizados[i].nomeGuerra,
          posto: militaresAtualizados[i].posto,
          quadro: militaresAtualizados[i].quadro,
          dataNascimento: militaresAtualizados[i].dataNascimento,
          dataInclusao: militaresAtualizados[i].dataInclusao,
          dataUltimaPromocao: militaresAtualizados[i].dataUltimaPromocao,
          situacao: militaresAtualizados[i].situacao,
          email: militaresAtualizados[i].email,
          foto: null,
          tipoSanguineo: militaresAtualizados[i].tipoSanguineo,
          sexo: militaresAtualizados[i].sexo
        });
        
        // Atualiza o status para sucesso
        militaresAtualizados[i] = { 
          ...militaresAtualizados[i], 
          status: "sucesso", 
          mensagem: "Importado com sucesso" 
        };
        contadorSucesso++;
      } catch (error: any) {
        // Atualiza o status para erro
        militaresAtualizados[i] = { 
          ...militaresAtualizados[i], 
          status: "erro", 
          mensagem: error.message || "Erro ao importar militar" 
        };
        contadorErro++;
      } finally {
        setMilitaresParaImportar([...militaresAtualizados]);
      }
    }
    
    setImportando(false);
    
    toast({
      title: "Importação concluída",
      description: `${contadorSucesso} militares importados com sucesso. ${contadorErro} erros.`,
      variant: contadorErro > 0 ? "destructive" : "default"
    });
  };

  // Renderiza o status do militar na tabela
  const renderStatus = (status?: string) => {
    switch (status) {
      case "pendente":
        return <span className="text-gray-500">Pendente</span>;
      case "processando":
        return <span className="text-blue-500">Processando...</span>;
      case "sucesso":
        return <span className="text-green-500 flex items-center gap-1">
          <CheckCircle size={16} /> Importado
        </span>;
      case "erro":
        return <span className="text-red-500 flex items-center gap-1">
          <AlertCircle size={16} /> Erro
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Importar Militares</h1>
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
            Importar de Arquivo PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("pdf-upload")?.click()}
              className="flex items-center gap-2"
              disabled={importando}
            >
              <Upload size={16} />
              Selecionar arquivo PDF
            </Button>
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={importando}
            />
            
            {importarArquivo && (
              <div className="flex items-center gap-2 text-sm">
                <FileCheck size={16} className="text-green-600" />
                <span>{importarArquivo.name}</span>
              </div>
            )}
          </div>
          
          {importando && (
            <div className="space-y-2">
              <Progress value={progresso} className="w-full" />
              <p className="text-sm text-gray-500">Importando militares... {Math.floor(progresso)}%</p>
            </div>
          )}
          
          {militaresParaImportar.length > 0 && (
            <>
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>Nome de Guerra</TableHead>
                      <TableHead>Posto</TableHead>
                      <TableHead>Quadro</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {militaresParaImportar.map((militar, index) => (
                      <TableRow key={index}>
                        <TableCell>{militar.nomeCompleto}</TableCell>
                        <TableCell>{militar.nomeGuerra}</TableCell>
                        <TableCell>{militar.posto}</TableCell>
                        <TableCell>{militar.quadro}</TableCell>
                        <TableCell>{renderStatus(militar.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={importarMilitares}
                  disabled={importando}
                  className="mt-4"
                >
                  {importando ? "Importando..." : "Iniciar Importação"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportarMilitares;
