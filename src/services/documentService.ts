
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Interface para armazenar dados processados de militares
export interface ProcessedMilitarData {
  totalMilitares: number;
  classificados: Record<string, number>;
  militares: {
    nome: string;
    posto: string;
    quadro: string;
    situacao: string;
  }[];
}

// Faz o upload do arquivo e escaneia para classificação dos militares
export const uploadAndScanMilitares = async (file: File): Promise<ProcessedMilitarData | null> => {
  try {
    // Upload file to storage
    const fileName = `scan-${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(fileName);
    
    // Process the file through the edge function
    const { data, error } = await supabase.functions
      .invoke('scan-militares', {
        body: { fileUrl: publicUrl }
      });
      
    if (error) throw error;
    
    // Return the processed data
    return data.processedData as ProcessedMilitarData;
  } catch (error) {
    console.error("Erro no upload ou processamento do arquivo:", error);
    toast({
      title: "Erro no processamento",
      description: "Não foi possível processar o arquivo.",
      variant: "destructive"
    });
    return null;
  }
};

// Função para baixar o modelo de documento para ficha conceito
export const downloadModeloFichaConceito = () => {
  // URL do modelo armazenado no Supabase Storage
  const { data } = supabase.storage
    .from('documentos')
    .getPublicUrl('modelos/modelo_ficha_conceito.docx');
    
  window.open(data.publicUrl, '_blank');
};

// Função para baixar o modelo de documento para dados de militares
export const downloadModeloDadosMilitares = () => {
  // URL do modelo armazenado no Supabase Storage
  const { data } = supabase.storage
    .from('documentos')
    .getPublicUrl('modelos/modelo_dados_militares.docx');
    
  window.open(data.publicUrl, '_blank');
};
