
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, FileCheck, AlertCircle, CheckCircle, 
  Table as TableIcon, FileSpreadsheet, Download 
} from "lucide-react";
import { 
  PostoPatente, QuadroMilitar, SituacaoMilitar, Sexo, TipoSanguineo 
} from "@/types";
import { createMilitar } from "@/services/militarService";

// Define the structure for military personnel data
interface MilitarImportData {
  matricula: string;
  posto: PostoPatente;
  quadro: QuadroMilitar;
  sexo: Sexo; // "M" ou "F"
  tipoSanguineo: TipoSanguineo; // "A+", "O-", etc.
  nomeCompleto: string;
  nomeGuerra: string;
  cpf: string;
  situacao: SituacaoMilitar;
  dataNascimento: string;
  dataInclusao: string;
  dataUltimaPromocao: string;
  status?: "pendente" | "processando" | "sucesso" | "erro";
  mensagem?: string;
}

const ImportarMilitares: React.FC = () => {
  const [militaresParaImportar, setMilitaresParaImportar] = useState<MilitarImportData[]>([]);
  const [importando, setImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [modoExemplo, setModoExemplo] = useState(false);

  const converterTipoSanguineo = (tipo: string): TipoSanguineo => {
    // Map the blood type from the data to our type
    const tipoNormalizado = tipo.toUpperCase().trim();
    if (["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(tipoNormalizado)) {
      return tipoNormalizado as TipoSanguineo;
    }
    return "O+"; // Default to O+ if invalid
  };

  const converterSexo = (sexo: string): Sexo => {
    return sexo.toUpperCase().trim() === "F" ? "Feminino" : "Masculino";
  };

  const converterQuadro = (quadro: string): QuadroMilitar => {
    // Map the quadro from the data to our type
    const quadroNormalizado = quadro.toUpperCase().trim();
    if (quadroNormalizado.includes("NVRR") || quadroNormalizado === "R" || quadroNormalizado === "RR") {
      return "QORR";
    } else if (quadroNormalizado.includes("QOBMC") || quadroNormalizado.includes("QOEM")) {
      return "QOEM";
    } else if (quadroNormalizado.includes("QOBMComb")) {
      return "QOE";
    } else {
      return "QPBM"; // Default to QPBM if none match
    }
  };

  const converterPosto = (posto: string): PostoPatente => {
    // Map the posto from the data to our type
    const postoNormalizado = posto.toUpperCase().trim();
    
    if (postoNormalizado.includes("CEL")) return "Coronel";
    if (postoNormalizado.includes("TEN CEL")) return "Tenente-Coronel";
    if (postoNormalizado.includes("MAJ")) return "Major";
    if (postoNormalizado.includes("CAP")) return "Capitão";
    if (postoNormalizado.includes("1º TEN")) return "1º Tenente";
    if (postoNormalizado.includes("2º TEN")) return "2º Tenente";
    if (postoNormalizado.includes("SUB")) return "Subtenente";
    if (postoNormalizado.includes("1º SGT")) return "1º Sargento";
    if (postoNormalizado.includes("2º SGT")) return "2º Sargento";
    if (postoNormalizado.includes("3º SGT")) return "3º Sargento";
    if (postoNormalizado.includes("CABO")) return "Cabo";
    if (postoNormalizado.includes("SD")) return "Soldado";
    
    return "Soldado"; // Default if none match
  };

  const converterSituacao = (situacao: string): SituacaoMilitar => {
    return situacao.toUpperCase().trim() === "ATIVO" ? "ativo" : "inativo";
  };

  const formatarData = (data: string): string => {
    if (!data || data.trim() === "") return "";
    
    // Try to convert DD/MM/YYYY format
    const partes = data.split("/");
    if (partes.length === 3) {
      return `${partes[0].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[2]}`;
    }
    
    // Try to convert DD/MM/YY format
    if (partes.length === 3 && partes[2].length === 2) {
      const ano = parseInt(partes[2]) > 50 ? `19${partes[2]}` : `20${partes[2]}`;
      return `${partes[0].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${ano}`;
    }
    
    // Try to parse dates in format DD/MM/YYYY
    try {
      const [dia, mes, ano] = data.split("/").map(Number);
      if (dia && mes && ano) {
        return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
      }
    } catch (e) {
      console.error("Erro ao formatar data:", data);
    }
    
    return data; // Return original if we can't parse
  };

  // Handle text file upload with military personnel data
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const linhas = text.split('\n').filter(linha => linha.trim() !== '');
        
        const militares: MilitarImportData[] = [];
        
        for (const linha of linhas) {
          // Skip header lines
          if (linha.includes("ORD") || linha.includes("IDENT")) continue;
          
          // Parse tab-separated or comma-separated values
          const campos = linha.split(/\t|,/).map(campo => campo.trim());
          
          if (campos.length >= 12) {
            const militar: MilitarImportData = {
              matricula: campos[2] || "",
              posto: converterPosto(campos[3] || ""),
              quadro: converterQuadro(campos[4] || ""),
              sexo: converterSexo(campos[5] || "M"),
              tipoSanguineo: converterTipoSanguineo(campos[6] || "O+"),
              nomeCompleto: campos[7] || "",
              nomeGuerra: campos[8] || "",
              cpf: campos[9] || "",
              situacao: converterSituacao(campos[10] || "ATIVO"),
              dataNascimento: formatarData(campos[11] || ""),
              dataInclusao: formatarData(campos[12] || ""),
              dataUltimaPromocao: formatarData(campos[13] || ""),
              status: "pendente"
            };
            
            if (militar.nomeCompleto && militar.nomeGuerra) {
              militares.push(militar);
            }
          }
        }
        
        setMilitaresParaImportar(militares);
        
        toast({
          title: "Arquivo processado com sucesso!",
          description: `${militares.length} militares encontrados no arquivo.`,
        });
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        toast({
          title: "Erro ao processar arquivo",
          description: "O arquivo não está no formato esperado.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  // Handle demo data for example
  const carregarExemplo = () => {
    // Simulate data from images for example purposes
    const dadosExemplo: MilitarImportData[] = [
      {
        matricula: "37310-4",
        posto: "Coronel",
        quadro: "QORR",
        sexo: "Masculino",
        tipoSanguineo: "O+",
        nomeCompleto: "José Arimatéia RÊGO de Araújo",
        nomeGuerra: "RÊGO",
        cpf: "396.478.973-91",
        situacao: "ativo",
        dataNascimento: "10/08/1967",
        dataInclusao: "01/02/1990",
        dataUltimaPromocao: "18/07/2016",
        status: "pendente"
      },
      {
        matricula: "08766-6",
        posto: "Tenente-Coronel",
        quadro: "QOE",
        sexo: "Masculino",
        tipoSanguineo: "O+",
        nomeCompleto: "SÁRVIO Pereira Silva Sousa",
        nomeGuerra: "SÁRVIO",
        cpf: "478.987.373-87",
        situacao: "ativo",
        dataNascimento: "18/01/1973",
        dataInclusao: "01/02/1993",
        dataUltimaPromocao: "18/07/2016",
        status: "pendente"
      },
      {
        matricula: "08736-4",
        posto: "Major",
        quadro: "QOEM",
        sexo: "Masculino",
        tipoSanguineo: "B+",
        nomeCompleto: "Gilson LOPES da Silva",
        nomeGuerra: "LOPES",
        cpf: "463.014.063-53",
        situacao: "ativo",
        dataNascimento: "04/09/1972",
        dataInclusao: "01/02/1993",
        dataUltimaPromocao: "18/07/2022",
        status: "pendente"
      },
      {
        matricula: "12464-8",
        posto: "Capitão",
        quadro: "QORR",
        sexo: "Masculino",
        tipoSanguineo: "O+",
        nomeCompleto: "MOACIR dos Santos Silva",
        nomeGuerra: "MOACIR",
        cpf: "217.361.463-72",
        situacao: "inativo",
        dataNascimento: "13/12/1959",
        dataInclusao: "29/03/1983",
        dataUltimaPromocao: "18/07/2012",
        status: "pendente"
      },
      {
        matricula: "37125-X",
        posto: "1º Tenente",
        quadro: "QORR",
        sexo: "Masculino",
        tipoSanguineo: "AB+",
        nomeCompleto: "JOSIMAR Moreira da Silva",
        nomeGuerra: "JOSIMAR",
        cpf: "349.520.633-72",
        situacao: "ativo",
        dataNascimento: "30/07/1968",
        dataInclusao: "11/03/1983",
        dataUltimaPromocao: "23/12/2016",
        status: "pendente"
      }
    ];
    
    setMilitaresParaImportar(dadosExemplo);
    setModoExemplo(true);
    
    toast({
      title: "Dados de exemplo carregados",
      description: "5 militares de exemplo foram carregados para demonstração."
    });
  };

  // Import the military personnel into the database
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
    
    // Copy the array to not modify state directly
    const militaresAtualizados = [...militaresParaImportar];
    
    let contadorSucesso = 0;
    let contadorErro = 0;
    
    for (let i = 0; i < militaresAtualizados.length; i++) {
      try {
        // Update status to processing
        militaresAtualizados[i] = { ...militaresAtualizados[i], status: "processando" };
        setMilitaresParaImportar([...militaresAtualizados]);
        
        // Calculate progress
        const progressoAtual = ((i + 1) / militaresAtualizados.length) * 100;
        setProgresso(progressoAtual);
        
        // Simulate a wait to visualize progress (only for demo)
        if (modoExemplo) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Call the function to create military personnel
        await createMilitar({
          nomeCompleto: militaresAtualizados[i].nomeCompleto,
          nomeGuerra: militaresAtualizados[i].nomeGuerra,
          posto: militaresAtualizados[i].posto,
          quadro: militaresAtualizados[i].quadro,
          dataNascimento: militaresAtualizados[i].dataNascimento,
          dataInclusao: militaresAtualizados[i].dataInclusao,
          dataUltimaPromocao: militaresAtualizados[i].dataUltimaPromocao,
          situacao: militaresAtualizados[i].situacao,
          email: `${militaresAtualizados[i].nomeGuerra.toLowerCase().replace(/\s/g, '.')}@cbm.pi.gov.br`,
          foto: null,
          tipoSanguineo: militaresAtualizados[i].tipoSanguineo,
          sexo: militaresAtualizados[i].sexo
        });
        
        // Update status to success
        militaresAtualizados[i] = { 
          ...militaresAtualizados[i], 
          status: "sucesso", 
          mensagem: "Importado com sucesso" 
        };
        contadorSucesso++;
      } catch (error: any) {
        // Update status to error
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

  // Create spreadsheet template for data input
  const baixarModelo = () => {
    const headers = "ORD\tIDENT.\tMATRÍCULA\tPOSTO/GRAD\tQUADRO\tF/M\tABO Rh\tNOME\tNOME DE GUERRA\tCPF\tSITUAÇÃO\tNASC.\tINCL./NOM.\tPROM./CONV.\n";
    const exemplo = "1\tGIP 10.1050\t12345-6\tCEL\tQOBMC\tM\tO+\tNome do Militar\tNOME\t123.456.789-00\tATIVO\t01/01/1970\t01/01/1990\t01/01/2020\n";
    
    const blob = new Blob([headers + exemplo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_militares.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Modelo baixado",
      description: "O arquivo modelo para importação foi baixado."
    });
  };

  // Render status of military personnel in table
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
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Importar Militares de Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="flex items-center gap-2"
              disabled={importando}
            >
              <Upload size={16} />
              Selecionar arquivo
            </Button>
            <input
              type="file"
              id="file-upload"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={importando}
            />
            
            <Button
              variant="outline"
              onClick={baixarModelo}
              className="flex items-center gap-2"
              disabled={importando}
            >
              <Download size={16} />
              Baixar modelo
            </Button>
            
            <Button
              variant="outline" 
              onClick={carregarExemplo}
              className="flex items-center gap-2"
              disabled={importando}
            >
              <FileSpreadsheet size={16} />
              Carregar exemplo
            </Button>
          </div>
          
          {importando && (
            <div className="space-y-2">
              <Progress value={progresso} className="w-full" />
              <p className="text-sm text-gray-500">Importando militares... {Math.floor(progresso)}%</p>
            </div>
          )}
          
          {militaresParaImportar.length > 0 && (
            <>
              <div className="rounded-md border mt-4 overflow-x-auto">
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
                    {militaresParaImportar.slice(0, 20).map((militar, index) => (
                      <TableRow key={index} className={
                        militar.status === "erro" ? "bg-red-50" : 
                        militar.status === "sucesso" ? "bg-green-50" : ""
                      }>
                        <TableCell>{militar.nomeCompleto}</TableCell>
                        <TableCell>{militar.nomeGuerra}</TableCell>
                        <TableCell>{militar.posto}</TableCell>
                        <TableCell>{militar.quadro}</TableCell>
                        <TableCell>
                          {renderStatus(militar.status)}
                          {militar.status === "erro" && (
                            <p className="text-xs text-red-500">{militar.mensagem}</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {militaresParaImportar.length > 20 && (
                <p className="text-sm text-gray-500 mt-2">
                  Mostrando 20 de {militaresParaImportar.length} militares.
                </p>
              )}
              
              <div className="flex justify-end">
                <Button
                  onClick={importarMilitares}
                  disabled={importando || militaresParaImportar.length === 0}
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
