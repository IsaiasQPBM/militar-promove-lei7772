
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { getMilitarById, updateMilitar } from "@/services/militarService";
import { QuadroMilitar, PostoPatente, SituacaoMilitar } from "@/types";
import { toQuadroMilitar } from "@/utils/typeConverters";

const formSchema = z.object({
  quadro: z.enum(["QOEM", "QOE", "QORR", "QPBM", "QPRR"] as const),
  posto: z.string().min(1, { message: "Selecione o posto/graduação" }),
  nomeCompleto: z.string().min(3, { message: "Nome completo deve ter no mínimo 3 caracteres" }),
  nomeGuerra: z.string().min(2, { message: "Nome de guerra deve ter no mínimo 2 caracteres" }),
  dataNascimento: z.date({
    required_error: "Data de nascimento é obrigatória",
  }),
  dataInclusao: z.date({
    required_error: "Data de inclusão é obrigatória",
  }),
  dataUltimaPromocao: z.date({
    required_error: "Data da última promoção é obrigatória",
  }),
  situacao: z.enum(["ativo", "inativo"] as const),
  email: z.string().email({ message: "Email inválido" })
});

type FormValues = z.infer<typeof formSchema>;

const EditarMilitar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedQuadro, setSelectedQuadro] = useState<QuadroMilitar>("QPBM");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quadro: "QPBM",
      posto: "",
      nomeCompleto: "",
      nomeGuerra: "",
      situacao: "ativo",
      email: ""
    }
  });

  useEffect(() => {
    const loadMilitarData = async () => {
      if (id) {
        try {
          setLoading(true);
          const militar = await getMilitarById(id);

          if (militar) {
            const quadroValue = toQuadroMilitar(militar.quadro);
            setSelectedQuadro(quadroValue);

            form.reset({
              quadro: quadroValue,
              posto: militar.posto,
              nomeCompleto: militar.nomeCompleto,
              nomeGuerra: militar.nomeGuerra,
              dataNascimento: new Date(militar.dataNascimento),
              dataInclusao: new Date(militar.dataInclusao),
              dataUltimaPromocao: new Date(militar.dataUltimaPromocao),
              situacao: militar.situacao as "ativo" | "inativo",
              email: militar.email
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
          setLoading(false);
        }
      }
    };

    loadMilitarData();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    try {
      setLoading(true);
      await updateMilitar(id, {
        quadro: values.quadro,
        posto: values.posto as PostoPatente,
        nomeCompleto: values.nomeCompleto,
        nomeGuerra: values.nomeGuerra,
        dataNascimento: format(values.dataNascimento, "yyyy-MM-dd"),
        dataInclusao: format(values.dataInclusao, "yyyy-MM-dd"),
        dataUltimaPromocao: format(values.dataUltimaPromocao, "yyyy-MM-dd"),
        situacao: values.situacao,
        email: values.email
      });

      toast({
        title: "Dados atualizados com sucesso!",
        description: `As informações de ${values.nomeCompleto} foram atualizadas.`,
      });

      let redirectPath = "/";
      if (values.quadro === "QOEM" || values.quadro === "QOE") {
        redirectPath = `/oficiais/${values.quadro === "QOEM" ? "estado-maior" : "especialistas"}`;
      } else if (values.quadro === "QORR") {
        redirectPath = "/oficiais/reserva";
      } else if (values.quadro === "QPBM") {
        redirectPath = "/pracas/ativos";
      } else if (values.quadro === "QPRR") {
        redirectPath = "/pracas/reserva";
      }

      navigate(redirectPath);
    } catch (error) {
      console.error("Erro ao atualizar militar:", error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPostoOptions = () => {
    if (selectedQuadro === "QOEM" || selectedQuadro === "QOE" || selectedQuadro === "QORR") {
      return [
        { value: "Coronel", label: "Coronel" },
        { value: "Tenente-Coronel", label: "Tenente-Coronel" },
        { value: "Major", label: "Major" },
        { value: "Capitão", label: "Capitão" },
        { value: "1º Tenente", label: "1º Tenente" },
        { value: "2º Tenente", label: "2º Tenente" }
      ];
    } else {
      return [
        { value: "Subtenente", label: "Subtenente" },
        { value: "1º Sargento", label: "1º Sargento" },
        { value: "2º Sargento", label: "2º Sargento" },
        { value: "3º Sargento", label: "3º Sargento" },
        { value: "Cabo", label: "Cabo" },
        { value: "Soldado", label: "Soldado" }
      ];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple"></div>
        <span className="ml-2">Carregando dados do militar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Dados do Militar</h1>
        <div className="space-x-2">
          <Button onClick={() => navigate(`/militar/${id}`)} variant="outline">
            Ver Ficha
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline">
            Voltar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seus campos de formulário aqui... (já estavam completos no seu envio) */}
              
              {/* Botões de Ações */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-cbmepi-purple text-white hover:bg-cbmepi-purple/90">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarMilitar;
