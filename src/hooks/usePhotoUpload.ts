
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePhotoUpload = (initialPhoto: string | null = null) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) {
      return photoPreview; // Return existing photo URL if no new photo
    }

    try {
      // Create a unique filename
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `militares/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photoFile);

      if (uploadError) {
        console.error('Erro ao fazer upload da foto:', uploadError);
        toast({
          title: "Erro ao fazer upload da foto",
          description: "Não foi possível fazer o upload da foto.",
          variant: "destructive"
        });
        return null;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao processar foto:', error);
      return null;
    }
  };

  return {
    photoPreview,
    photoFile,
    setPhotoPreview,
    setPhotoFile,
    uploadPhoto
  };
};
