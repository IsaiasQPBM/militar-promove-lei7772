
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import { formSchema, FormValues } from "@/utils/militarValidation";
import { getMilitarById, updateMilitar } from "@/services/militarService";
import { format } from "date-fns";
import { QuadroMilitar, PostoPatente, SituacaoMilitar } from "@/types";

// Form Components
import QuadroPostoSelect from "@/components/militar/QuadroPostoSelect";
import DadosPessoais from "@/components/militar/DadosPessoais";
import DatasImportantes from "@/components/militar/DatasImportantes";
import SituacaoEmail from "@/components/militar/SituacaoEmail";
import FormNavigation from "@/components/militar/FormNavigation";
import { verificarDisponibilidadeVaga } from "@/services/qfvService";

const EditarMilitar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedQuadro, setSelectedQuadro] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    const loadMilitar = async () => {
      if (!id) return;
      
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
          form.reset({
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
          
          // Atualizar o estado do quadro selecionado para correta exibição dos postos
          setSelectedQuadro(militar.quadro);
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
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    
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
      await updateMilitar(id, {
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

  // Tab navigation
  const handleNext = () => {
    const tabs = ["quadro-posto", "dados-pessoais", "datas", "situacao-contato"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = ["quadro-posto", "dados-pessoais", "datas", "situacao-contato"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const isFirstTab = activeTab === "quadro-posto";
  const isLastTab = activeTab === "situacao-contato";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do militar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Militar</h1>
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
            <UserPlus className="h-5 w-5" />
            Atualizar Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarMilitar;
