
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const uploadPDF = async (file: File, militarId: string) => {
  try {
    // Upload file to storage
    const fileName = `${militarId}-${Date.now()}-${file.name}`;
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
    
    // Process the PDF through our edge function
    const { data, error } = await supabase.functions
      .invoke('process-pdf', {
        body: { fileUrl: publicUrl, militarId }
      });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro no upload ou processamento do PDF:", error);
    toast({
      title: "Erro no processamento",
      description: "Não foi possível processar o arquivo PDF.",
      variant: "destructive"
    });
    throw error;
  }
};
