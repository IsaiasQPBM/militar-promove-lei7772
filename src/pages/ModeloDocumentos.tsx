
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ModeloDocumentos = () => {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  
  // Função para gerar o conteúdo do modelo de documento
  const gerarConteudoFichaConceito = () => {
    return `FICHA DE CONCEITO DE OFICIAL

DADOS PESSOAIS
Nome completo: 
Posto: 
Matrícula: 
Quadro: 
Data da última promoção: 

CURSOS MILITARES
1. Nome do curso: 
   Instituição: 
   Carga horária: 
   Tipo: [Formação/Especialização/Aperfeiçoamento/Altos Estudos]
   Data de conclusão: 

2. Nome do curso: 
   Instituição: 
   Carga horária: 
   Tipo: [Formação/Especialização/Aperfeiçoamento/Altos Estudos]
   Data de conclusão: 

CURSOS CIVIS
1. Nome do curso: 
   Instituição: 
   Carga horária: 
   Tipo: [Médio/Técnico/Superior/Especialização/Mestrado/Doutorado]
   Data de conclusão: 

2. Nome do curso: 
   Instituição: 
   Carga horária: 
   Tipo: [Médio/Técnico/Superior/Especialização/Mestrado/Doutorado]
   Data de conclusão: 

CONDECORAÇÕES
1. Tipo: 
   Descrição: 
   Data de recebimento: 

2. Tipo: 
   Descrição: 
   Data de recebimento: 

ELOGIOS
1. Tipo: [Individual/Coletivo]
   Descrição: 
   Data de recebimento: 

2. Tipo: [Individual/Coletivo]
   Descrição: 
   Data de recebimento: 

PUNIÇÕES
1. Tipo: [Advertência/Repreensão/Detenção/Prisão]
   Descrição: 
   Data de recebimento: 

2. Tipo: [Advertência/Repreensão/Detenção/Prisão]
   Descrição: 
   Data de recebimento: 
`;
  };

  // Função para gerar o conteúdo do modelo de dados de militares
  const gerarConteudoDadosMilitares = () => {
    return `DADOS CADASTRAIS DO MILITAR

DADOS PESSOAIS
Nome completo: 
Nome de guerra: 
Data de nascimento: 
Sexo: [Masculino/Feminino]
Tipo sanguíneo: 
Email: 

DADOS FUNCIONAIS
Matrícula: 
Posto/Graduação: 
Quadro: [QOEM/QOE/QORR/QPBM/QPRR]
Unidade: 
Situação: [Ativo/Inativo/Reforma/Reserva]
Data de ingresso: 
Data da última promoção: 

FORMAÇÃO
1. Curso: 
   Instituição: 
   Tipo: [Militar/Civil]
   Ano de conclusão: 
   Carga horária: 

2. Curso: 
   Instituição: 
   Tipo: [Militar/Civil]
   Ano de conclusão: 
   Carga horária: 

HISTÓRICO DE PROMOÇÕES
1. Posto/Graduação anterior: 
   Posto/Graduação atual: 
   Data da promoção: 
   Critério: [Antiguidade/Merecimento]

2. Posto/Graduação anterior: 
   Posto/Graduação atual: 
   Data da promoção: 
   Critério: [Antiguidade/Merecimento]
`;
  };
  
  // Função para baixar o modelo de documento
  const downloadTemplate = async (type: "ficha-conceito" | "dados-militares") => {
    try {
      setDownloading(true);
      
      let fileName = "";
      let fileContent = "";
      
      if (type === "ficha-conceito") {
        fileName = "modelo_ficha_conceito_oficial.docx";
        fileContent = gerarConteudoFichaConceito();
      } else {
        fileName = "modelo_dados_militares.docx";
        fileContent = gerarConteudoDadosMilitares();
      }
      
      // Criar blob e fazer download
      const blob = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Documento baixado com sucesso",
        description: `O modelo ${fileName} foi baixado.`,
      });
    } catch (error) {
      console.error("Erro ao baixar modelo:", error);
      toast({
        title: "Erro ao baixar modelo",
        description: "Não foi possível baixar o modelo do documento.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Modelos de Documentos</h1>
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
            <FileText className="h-5 w-5" />
            Modelos de Documentos para Importação
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="rounded-md border p-4 bg-amber-50">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-amber-800">Instruções para uso dos modelos</h4>
                <p className="text-sm text-amber-700">
                  Baixe e preencha os modelos abaixo com as informações necessárias. 
                  Em seguida, faça o upload do documento preenchido na área correspondente do sistema. 
                  O sistema utilizará IA para extrair as informações e preencher automaticamente os campos.
                  Os formatos aceitos são DOCX e PDF.
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Modelo para Ficha de Conceito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Este documento contém os campos necessários para importar dados para a Ficha de Conceito do Oficial, 
                  incluindo cursos, condecorações, elogios e punições.
                </p>
                <Button 
                  onClick={() => downloadTemplate("ficha-conceito")} 
                  className="w-full"
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Modelo
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Modelo para Dados de Militares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Este documento contém os campos necessários para importar dados gerais de militares, 
                  incluindo nome completo, posto/graduação, quadro, data de nascimento e outros dados pessoais.
                </p>
                <Button 
                  onClick={() => downloadTemplate("dados-militares")} 
                  className="w-full"
                  disabled={downloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Modelo
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModeloDocumentos;
