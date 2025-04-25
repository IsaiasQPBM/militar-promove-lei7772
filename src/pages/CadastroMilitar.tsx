import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parse, parseISO } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";
import { formSchema, type FormValues } from "@/utils/militarValidation";
import QuadroPostoSelect from "@/components/militar/QuadroPostoSelect";
import DadosPessoais from "@/components/militar/DadosPessoais";
import DatasImportantes from "@/components/militar/DatasImportantes";
import SituacaoEmail from "@/components/militar/SituacaoEmail";
import { UserPlus } from "lucide-react";

const CadastroMilitar = () => {
  const navigate = useNavigate();
  const [selectedQuadro, setSelectedQuadro] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      
      let dataNascimento: Date;
      let dataInclusao: Date;
      let dataUltimaPromocao: Date;
      
      try {
        dataNascimento = parse(values.dataNascimento, "dd/MM/yyyy", new Date());
        if (isNaN(dataNascimento.getTime())) throw new Error("Data de nascimento inválida");
      } catch (error) {
        toast({
          title: "Erro na data de nascimento",
          description: "Formato inválido. Use DD/MM/AAAA",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      try {
        dataInclusao = parse(values.dataInclusao, "dd/MM/yyyy", new Date());
        if (isNaN(dataInclusao.getTime())) throw new Error("Data de inclusão inválida");
      } catch (error) {
        toast({
          title: "Erro na data de inclusão",
          description: "Formato inválido. Use DD/MM/AAAA",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      try {
        dataUltimaPromocao = parse(values.dataUltimaPromocao, "dd/MM/yyyy", new Date());
        if (isNaN(dataUltimaPromocao.getTime())) throw new Error("Data de última promoção inválida");
      } catch (error) {
        toast({
          title: "Erro na data de última promoção",
          description: "Formato inválido. Use DD/MM/AAAA",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      let quadroFinal = values.quadro;
      if (values.situacao === "inativo") {
        if (quadroFinal === "QOEM" || quadroFinal === "QOE") {
          quadroFinal = "QORR";
        } else if (quadroFinal === "QPBM") {
          quadroFinal = "QPRR";
        }
      }
      
      const novoMilitar = {
        id: uuidv4(),
        quadro: quadroFinal,
        posto: values.posto,
        nomeCompleto: values.nomeCompleto,
        nomeGuerra: values.nomeGuerra,
        foto: `https://api.dicebear.com/7.x/initials/svg?seed=${values.nomeGuerra}`,
        dataNascimento: dataNascimento.toISOString(),
        dataInclusao: dataInclusao.toISOString(),
        dataUltimaPromocao: dataUltimaPromocao.toISOString(),
        situacao: values.situacao,
        email: values.email
      };
      
      console.log("Militar cadastrado:", novoMilitar);
      
      toast({
        title: "Militar cadastrado com sucesso!",
        description: `${values.nomeCompleto} foi adicionado ao quadro ${quadroFinal}`,
      });
      
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
              <QuadroPostoSelect 
                form={form} 
                selectedQuadro={selectedQuadro} 
                setSelectedQuadro={setSelectedQuadro} 
              />
              
              <DadosPessoais form={form} />
              
              <DatasImportantes form={form} />
              
              <SituacaoEmail form={form} />
              
              <div>
                <Label htmlFor="photo">Foto (opcional)</Label>
                <Input id="photo" type="file" accept="image/*" className="mt-1" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroMilitar;
