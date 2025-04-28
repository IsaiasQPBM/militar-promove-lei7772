
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
import { toQuadroMilitar, toPostoPatente, fromQuadroMilitar, fromPostoPatente } from "@/utils/typeConverters";

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
      quadro: "QPBM" as const,
      posto: "",
      nomeCompleto: "",
      nomeGuerra: "",
      situacao: "ativo" as const,
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
      
      // Determinar para qual página navegar com base no quadro
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
  
  // Função para determinar as opções de posto com base no quadro selecionado
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
          <Button
            onClick={() => navigate(`/militar/${id}`)}
            variant="outline"
          >
            Ver Ficha
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quadro de pertencimento */}
                <FormField
                  control={form.control}
                  name="quadro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quadro de Pertencimento</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedQuadro(value);
                          // Reset posto selection when quadro changes
                          form.setValue("posto", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o quadro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="QOEM">QOEM - Estado-Maior</SelectItem>
                          <SelectItem value="QOE">QOE - Especialistas</SelectItem>
                          <SelectItem value="QORR">QORR - Reserva Remunerada (Oficiais)</SelectItem>
                          <SelectItem value="QPBM">QPBM - Praças</SelectItem>
                          <SelectItem value="QPRR">QPRR - Reserva Remunerada (Praças)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Posto atual */}
                <FormField
                  control={form.control}
                  name="posto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posto/Graduação</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedQuadro}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedQuadro ? "Selecione o posto/graduação" : "Selecione o quadro primeiro"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getPostoOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome completo */}
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Nome de guerra */}
                <FormField
                  control={form.control}
                  name="nomeGuerra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de Guerra</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome de guerra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Data de nascimento */}
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Data de inclusão */}
                <FormField
                  control={form.control}
                  name="dataInclusao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Inclusão</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Data da última promoção */}
                <FormField
                  control={form.control}
                  name="dataUltimaPromocao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data da Última Promoção</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Situação */}
                <FormField
                  control={form.control}
                  name="situacao"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Situação</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="ativo" />
                            </FormControl>
                            <FormLabel className="font-normal">Ativo</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="inativo" />
                            </FormControl>
                            <FormLabel className="font-normal">Inativo</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite o email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Foto */}
              <div>
                <Label htmlFor="photo">Alterar Foto (opcional)</Label>
                <Input id="photo" type="file" accept="image/*" className="mt-1" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
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
