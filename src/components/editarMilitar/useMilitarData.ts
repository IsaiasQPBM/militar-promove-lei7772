
import { useState, useEffect } from "react";
import { getMilitarById } from "@/services/militarService";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { FormValues } from "@/utils/militarValidation";

export const useMilitarData = (id: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormValues | null>(null);

  useEffect(() => {
    const loadMilitar = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const militar = await getMilitarById(id);
        
        if (militar) {
          // Convertendo datas para o formato DD/MM/AAAA
          const formatDate = (dateString: string) => {
            if (!dateString) return "";
            try {
              return format(new Date(dateString), "dd/MM/yyyy");
            } catch (e) {
              console.error("Erro ao formatar data:", e);
              return "";
            }
          };

          // Preencher o formulário com os dados do militar
          setFormData({
            quadro: militar.quadro,
            posto: militar.posto,
            nomeCompleto: militar.nomeCompleto,
            nomeGuerra: militar.nomeGuerra,
            dataNascimento: formatDate(militar.dataNascimento),
            dataInclusao: formatDate(militar.dataInclusao),
            dataUltimaPromocao: formatDate(militar.dataUltimaPromocao),
            situacao: militar.situacao,
            email: militar.email || ""
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do militar:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do militar.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMilitar();
  }, [id]);

  return { isLoading, formData };
};
