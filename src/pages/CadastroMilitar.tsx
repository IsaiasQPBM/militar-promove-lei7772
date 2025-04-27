
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parse } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { formSchema, type FormValues } from "@/utils/militarValidation";
import QuadroPostoSelect from "@/components/militar/QuadroPostoSelect";
import DadosPessoais from "@/components/militar/DadosPessoais";
import DatasImportantes from "@/components/militar/DatasImportantes";
import SituacaoEmail from "@/components/militar/SituacaoEmail";
import { UserPlus } from "lucide-react";
import { submitMilitarForm } from "@/utils/militarFormSubmission";
import { QuadroMilitar, SituacaoMilitar, PostoPatente } from "@/types";

const CadastroMilitar = () => {
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
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const result = await submitMilitarForm(values, navigate);
      
      if (result.success) {
        toast({
          title: "Militar cadastrado com sucesso!",
          description: `${values.nomeCompleto} foi adicionado ao quadro ${result.quadro}`,
        });
        
        navigate(result.redirectPath);
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar militar:", error);
      toast({
        title: "Erro ao cadastrar militar",
        description: error.message || "Ocorreu um erro ao salvar os dados",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cadastrar Novo Militar</h1>
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
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs 
                defaultValue="quadro-posto" 
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
                  
                  <div>
                    <Label htmlFor="photo">Foto (opcional)</Label>
                    <Input id="photo" type="file" accept="image/*" className="mt-1" />
                  </div>
                </TabsContent>
                
                <TabsContent value="datas" className="space-y-4">
                  <DatasImportantes form={form} />
                </TabsContent>
                
                <TabsContent value="situacao-contato" className="space-y-4">
                  <SituacaoEmail form={form} />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  {activeTab !== "quadro-posto" && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        const tabs = ["quadro-posto", "dados-pessoais", "datas", "situacao-contato"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1]);
                        }
                      }}
                    >
                      Anterior
                    </Button>
                  )}
                  
                  {activeTab !== "situacao-contato" && (
                    <Button 
                      type="button"
                      onClick={() => {
                        const tabs = ["quadro-posto", "dados-pessoais", "datas", "situacao-contato"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1]);
                        }
                      }}
                    >
                      Próximo
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Militar"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroMilitar;
