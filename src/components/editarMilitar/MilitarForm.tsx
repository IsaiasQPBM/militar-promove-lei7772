
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formSchema, FormValues } from "@/utils/militarValidation";
import { QuadroMilitar, PostoPatente, SituacaoMilitar } from "@/types";
import { updateMilitar } from "@/services/militarService";
import { verificarDisponibilidadeVaga } from "@/services/qfvService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Form Components
import DadosPessoais from "@/components/militar/DadosPessoais";
import DatasImportantes from "@/components/militar/DatasImportantes";
import SituacaoEmail from "@/components/militar/SituacaoEmail";
import FormNavigation from "@/components/military/FormNavigation";

interface MilitarFormProps {
  militarData: FormValues | null;
  militarId: string;
  isLoading: boolean;
}

const MilitarForm = ({ militarData, militarId, isLoading }: MilitarFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quadro: "",
      posto: "",
      nomeCompleto: "",
      nomeGuerra: "",
      dataNascimento: "",
      dataInclusao: "",
      dataUltimaPromocao: "",
      situacao: "ativo",
      email: "",
      tipoSanguineo: "O+",
      sexo: "Masculino"
    }
  });

  useEffect(() => {
    if (militarData) {
      form.reset(militarData);
      if (militarData.foto) {
        setPhotoPreview(militarData.foto);
      }
    }
  }, [militarData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPhotoFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

  const onSubmit = async (values: FormValues) => {
    if (!militarId) return;
    
    try {
      setIsSubmitting(true);
      
      // Upload photo if changed
      const photoUrl = await uploadPhoto();
      
      // Verificar se a situação deve alterar o quadro
      let quadroFinal = values.quadro as QuadroMilitar;
      if (values.situacao === "inativo") {
        if (quadroFinal === "QOEM" || quadroFinal === "QOE" || quadroFinal === "QOBM-S" || 
            quadroFinal === "QOBM-E" || quadroFinal === "QOBM-C") {
          quadroFinal = "QORR";
        } else if (quadroFinal === "QPBM") {
          quadroFinal = "QPRR";
        }
      }
      
      // Verificar se a situação está mudando para ativo
      const currentValues = form.getValues();
      if (values.situacao === "ativo" && 
          (currentValues.situacao !== values.situacao)) {
        
        // Verificar se tem vagas disponíveis
        const { disponivel, mensagem } = await verificarDisponibilidadeVaga(
          values.posto as PostoPatente, 
          quadroFinal
        );
        
        if (!disponivel) {
          toast({
            title: "Sem vagas disponíveis",
            description: mensagem,
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Atualizar o militar no banco de dados
      await updateMilitar(militarId, {
        nomeCompleto: values.nomeCompleto,
        nomeGuerra: values.nomeGuerra,
        quadro: quadroFinal,
        posto: values.posto as PostoPatente,
        dataNascimento: values.dataNascimento,
        dataInclusao: values.dataInclusao,
        dataUltimaPromocao: values.dataUltimaPromocao,
        situacao: values.situacao as SituacaoMilitar,
        email: values.email,
        foto: photoUrl,
        tipoSanguineo: values.tipoSanguineo,
        sexo: values.sexo
      });
      
      toast({
        title: "Militar atualizado com sucesso!",
        description: `Os dados de ${values.nomeCompleto} foram atualizados.`
      });
      
      // Determinar para qual página redirecionar
      let redirectPath = "/";
      
      if (quadroFinal === "QOEM") {
        redirectPath = "/oficiais/estado-maior";
      } else if (quadroFinal === "QOE") {
        redirectPath = "/oficiais/especialistas";
      } else if (quadroFinal === "QOBM-S") {
        redirectPath = "/oficiais/saude";
      } else if (quadroFinal === "QOBM-E") {
        redirectPath = "/oficiais/engenheiros";
      } else if (quadroFinal === "QOBM-C") {
        redirectPath = "/oficiais/complementares";
      } else if (quadroFinal === "QORR") {
        redirectPath = "/oficiais/reserva";
      } else if (quadroFinal === "QPBM") {
        redirectPath = "/pracas/ativos";
      } else if (quadroFinal === "QPRR") {
        redirectPath = "/pracas/reserva";
      }
      
      navigate(redirectPath);
      
    } catch (error) {
      console.error("Erro ao atualizar militar:", error);
      toast({
        title: "Erro ao atualizar militar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do militar...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt="Foto do militar" />
              ) : (
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {militarData?.nomeGuerra?.substring(0, 2) || "BM"}
                </AvatarFallback>
              )}
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                <Camera className="h-4 w-4" />
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </Avatar>
          </div>
          <p className="text-xs text-gray-500 mt-2">Clique no ícone para {photoPreview ? "alterar" : "adicionar"} foto</p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="datas">Datas Importantes</TabsTrigger>
            <TabsTrigger value="situacao-contato">Situação e Contato</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados-pessoais" className="space-y-4">
            <DadosPessoais form={form} />
          </TabsContent>
          
          <TabsContent value="datas" className="space-y-4">
            <DatasImportantes form={form} />
          </TabsContent>
          
          <TabsContent value="situacao-contato" className="space-y-4">
            <SituacaoEmail form={form} />
          </TabsContent>
        </Tabs>
        
        <FormNavigation 
          activeTab={activeTab}
          isLastTab={activeTab === "situacao-contato"}
          isFirstTab={activeTab === "dados-pessoais"}
          isSubmitting={isSubmitting}
          onPrevious={() => {
            const tabs = ["dados-pessoais", "datas", "situacao-contato"];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
              setActiveTab(tabs[currentIndex - 1]);
            }
          }}
          onNext={() => {
            const tabs = ["dados-pessoais", "datas", "situacao-contato"];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
              setActiveTab(tabs[currentIndex + 1]);
            }
          }}
          onCancel={() => navigate(-1)}
        />
      </form>
    </Form>
  );
};

export default MilitarForm;
