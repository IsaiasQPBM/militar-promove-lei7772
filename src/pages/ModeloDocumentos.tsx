
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
  
  // Function to download the template document
  const downloadTemplate = async (type: "ficha-conceito" | "dados-militares") => {
    try {
      setDownloading(true);
      
      // In a production environment, these would be actual files stored in Supabase Storage
      let fileName = "";
      let fileContent = "";
      
      if (type === "ficha-conceito") {
        fileName = "modelo_ficha_conceito_oficial.docx";
        fileContent = "Modelo de documento para importação na Ficha de Conceito do Oficial";
      } else {
        fileName = "modelo_dados_militares.docx";
        fileContent = "Modelo de documento para importação de dados gerais de militares";
      }
      
      // Create a blob and download it
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
