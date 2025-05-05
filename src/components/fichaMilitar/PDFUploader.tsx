
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { uploadPDF } from "@/services/pdfService";
import { importDataFromPDFExtraction } from "@/services/fichaService";
import { Loader2, Upload } from "lucide-react";

interface PDFUploaderProps {
  militarId: string;
  onDataImported: () => void;
}

export const PDFUploader = ({ militarId, onDataImported }: PDFUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo PDF ou DOCX.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo não pode ter mais de 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !militarId) return;
    
    try {
      setIsUploading(true);
      
      // Upload and process the PDF
      const processedData = await uploadPDF(selectedFile, militarId);
      
      // Import the extracted data into the database
      if (processedData?.extractedData) {
        await importDataFromPDFExtraction(militarId, processedData.extractedData);
        
        toast({
          title: "Dados importados com sucesso",
          description: "As informações do arquivo foram processadas e salvas."
        });
        
        // Reset form state
        setSelectedFile(null);
        
        // Notify parent component to refresh data
        onDataImported();
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível processar o arquivo.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle>Importar dados de documento</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <p>Faça upload de um documento PDF ou DOCX para extrair automaticamente informações para a ficha do militar.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="border-dashed border-2 rounded-md p-6 text-center">
            <Input 
              type="file" 
              className="hidden" 
              id="pdf-upload" 
              onChange={handleFileChange}
              accept=".pdf,.docx"
            />
            <label 
              htmlFor="pdf-upload" 
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm font-medium">
                {selectedFile ? selectedFile.name : 'Clique para selecionar um arquivo'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {!selectedFile && 'PDF ou DOCX (máx 10MB)'}
              </span>
            </label>
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : 'Processar e importar dados'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
