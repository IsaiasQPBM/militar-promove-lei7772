
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Download, FileText } from "lucide-react";

const ModeloDocumentos: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ficha-militar");
  
  const handleDownload = (tipo: string) => {
    // In a real application, we would download a template file
    // For now, we'll just show a success message
    toast({
      title: "Download iniciado",
      description: `O modelo de documento para ${tipo} está sendo baixado.`
    });
    
    // Create JSON model object based on the selected tab
    let modelData = {};
    
    if (tipo === "ficha-militar") {
      modelData = {
        pessoal: {
          nome: "Nome Completo do Militar",
          nomeGuerra: "Nome de Guerra",
          matricula: "Matrícula",
          posto: "Posto ou Graduação",
          quadro: "Código do Quadro (QOEM, QOE, QORR, QPBM, QPRR)",
          dataNascimento: "AAAA-MM-DD",
          tipoSanguineo: "A+, A-, B+, B-, AB+, AB-, O+, O-",
          sexo: "M ou F",
        },
        formacao: {
          cursosMilitares: [
            {
              nome: "Nome do Curso",
              tipo: "Especialização, CSBM, CFSD, etc",
              instituicao: "Nome da Instituição",
              cargaHoraria: "Carga horária em horas"
            }
          ],
          cursosCivis: [
            {
              nome: "Nome do Curso",
              tipo: "Superior, Especialização, Mestrado, Doutorado",
              instituicao: "Nome da Instituição",
              cargaHoraria: "Carga horária em horas"
            }
          ]
        }
      };
    } else if (tipo === "ficha-conceito") {
      modelData = {
        fichaConceitoLei5461: {
          tempoServicoQuadro: "Tempo (em anos) no posto atual",
          cursosMilitares: {
            especializacao: "Quantidade",
            csbm: "Quantidade",
            cfsd: "Quantidade",
            chc: "Quantidade",
            chsgt: "Quantidade",
            cas: "Quantidade",
            cho: "Quantidade",
            cfo: "Quantidade",
            cao: "Quantidade"
          },
          cursosCivis: {
            superior: "Quantidade",
            especializacao: "Quantidade",
            mestrado: "Quantidade",
            doutorado: "Quantidade"
          },
          condecoracoes: {
            governoFederal: "Quantidade",
            governoEstadual: "Quantidade",
            cbmepi: "Quantidade"
          },
          elogios: {
            individual: "Quantidade",
            coletivo: "Quantidade"
          },
          punicoes: {
            repreensao: "Quantidade",
            detencao: "Quantidade",
            prisao: "Quantidade"
          },
          faltaAproveitamentoCursos: "Quantidade"
        }
      };
    } else if (tipo === "militares-import") {
      modelData = {
        militares: [
          {
            nome: "Nome Completo do Militar",
            nomeGuerra: "Nome de Guerra",
            matricula: "Matrícula",
            posto: "Posto ou Graduação",
            quadro: "Código do Quadro (QOEM, QOE, QORR, QPBM, QPRR)",
            dataNascimento: "AAAA-MM-DD",
            dataIngresso: "AAAA-MM-DD",
            dataUltimaPromocao: "AAAA-MM-DD",
            situacao: "ativo ou inativo",
            tipoSanguineo: "A+, A-, B+, B-, AB+, AB-, O+, O-",
            sexo: "M ou F",
            unidade: "Unidade de Lotação",
            email: "email@exemplo.com"
          }
        ]
      };
    }
    
    // Convert to JSON string with proper formatting
    const jsonString = JSON.stringify(modelData, null, 2);
    
    // Create and trigger download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modelo-${tipo}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Modelos de Documentos</h1>
      <p className="text-gray-600">
        Baixe os modelos de documentos para importação de dados no sistema.
        Os modelos servem como referência para estruturar seus dados para importação.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="ficha-militar">Ficha Militar</TabsTrigger>
          <TabsTrigger value="ficha-conceito">Ficha de Conceito</TabsTrigger>
          <TabsTrigger value="militares-import">Importação de Militares</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ficha-militar">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Modelo para Ficha Militar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p>Este modelo contém os campos necessários para importar dados pessoais e de formação do militar.</p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">O modelo inclui:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dados pessoais (nome, posto, matrícula, etc)</li>
                  <li>Cursos militares</li>
                  <li>Cursos civis</li>
                  <li>Condecorações</li>
                  <li>Elogios e punições</li>
                </ul>
              </div>
              
              <Button onClick={() => handleDownload("ficha-militar")} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Baixar Modelo para Ficha Militar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ficha-conceito">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Modelo para Ficha de Conceito
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p>Este modelo contém os campos necessários para importar dados da Ficha de Conceito do Oficial (Lei 5461).</p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">O modelo inclui:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tempo de serviço no quadro</li>
                  <li>Cursos militares (quantidade por tipo)</li>
                  <li>Cursos civis (quantidade por tipo)</li>
                  <li>Condecorações (quantidade por tipo)</li>
                  <li>Elogios (quantidade por tipo)</li>
                  <li>Punições (quantidade por tipo)</li>
                </ul>
              </div>
              
              <Button onClick={() => handleDownload("ficha-conceito")} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Baixar Modelo para Ficha de Conceito
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="militares-import">
          <Card>
            <CardHeader className="bg-cbmepi-purple text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Modelo para Importação de Militares
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p>Este modelo contém os campos necessários para importar múltiplos militares de uma vez.</p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">O modelo inclui:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lista de militares com dados pessoais completos</li>
                  <li>Campos para classificação por quadro (QOEM, QOE, etc)</li>
                  <li>Dados de situação (ativo/inativo)</li>
                  <li>Datas importantes (nascimento, ingresso, promoção)</li>
                </ul>
              </div>
              
              <Button onClick={() => handleDownload("militares-import")} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Baixar Modelo para Importação de Militares
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeloDocumentos;
