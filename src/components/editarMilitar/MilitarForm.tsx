
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

// Form Components
import QuadroPostoSelect from "@/components/militar/QuadroPostoSelect";
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
  const [selectedQuadro, setSelectedQuadro] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("quadro-posto");

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
      email: ""
    }
  });

  useEffect(() => {
    if (militarData) {
      form.reset(militarData);
      setSelectedQuadro(militarData.quadro);
    }
  }, [militarData, form]);

  const onSubmit = async (values: FormValues) => {
    if (!militarId) return;
    
    try {
      setIsSubmitting(true);
      
      // Verificar se o quadro deve ser ajustado com base na situação
      let quadroFinal = values.quadro as QuadroMilitar;
      if (values.situacao === "inativo") {
        if (quadroFinal === "QOEM" || quadroFinal === "QOE") {
          quadroFinal = "QORR";
        } else if (quadroFinal === "QPBM") {
          quadroFinal = "QPRR";
        }
      }
      
      // Se estiver mudando para ativo ou alterando posto/quadro, verificar disponibilidade
      const currentValues = form.getValues();
      if (values.situacao === "ativo" && 
          (currentValues.situacao !== values.situacao || 
           currentValues.posto !== values.posto || 
           currentValues.quadro !== values.quadro)) {
        
        // Verificar se o novo posto/quadro tem vagas disponíveis
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
        email: values.email
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
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="quadro-posto">Quadro e Posto</TabsTrigger>
            <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="datas">Datas Importantes</TabsTrigger>
            <TabsTrigger value="situacao-contato">Situação e Contato</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quadro-posto" className="space-y-4">
            <QuadroPostoSelect 
              form={form} 
              selectedQuadro={selectedQuadro} 
              setSelectedQuadro={setSelectedQuadro} 
            />
          </TabsContent>
          
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
          isFirstTab={activeTab === "quadro-posto"}
          isSubmitting={isSubmitting}
          onPrevious={() => {
            const tabs = ["quadro-posto", "dados-pessoais", "datas", "situacao-contato"];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
              setActiveTab(tabs[currentIndex - 1]);
            }
          }}
          onNext={() => {
            const tabs = ["quadro-posto", "dados-pessoais", "datas", "situacao-contato"];
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
