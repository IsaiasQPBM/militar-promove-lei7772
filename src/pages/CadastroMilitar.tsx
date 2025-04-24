
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Função para validar formato da data (DD/MM/YYYY)
const isValidDateString = (dateString: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  return isValid(parsedDate);
};

// Schema com validações para as datas
const formSchema = z.object({
  quadro: z.string().min(1, { message: "Selecione o quadro de pertencimento" }),
  posto: z.string().min(1, { message: "Selecione o posto/graduação" }),
  nomeCompleto: z.string().min(3, { message: "Nome completo deve ter no mínimo 3 caracteres" }),
  nomeGuerra: z.string().min(2, { message: "Nome de guerra deve ter no mínimo 2 caracteres" }),
  dataNascimento: z.string().refine(isValidDateString, {
    message: "Data inválida. Use o formato DD/MM/AAAA",
  }),
  dataInclusao: z.string().refine(isValidDateString, {
    message: "Data inválida. Use o formato DD/MM/AAAA",
  }),
  dataUltimaPromocao: z.string().refine(isValidDateString, {
    message: "Data inválida. Use o formato DD/MM/AAAA",
  }),
  situacao: z.enum(["ativo", "inativo"]),
  email: z.string().email({ message: "Email inválido" })
});

type FormValues = z.infer<typeof formSchema>;

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
      
      // Converter strings de data para objetos Date
      const dataNascimento = parse(values.dataNascimento, "dd/MM/yyyy", new Date());
      const dataInclusao = parse(values.dataInclusao, "dd/MM/yyyy", new Date());
      const dataUltimaPromocao = parse(values.dataUltimaPromocao, "dd/MM/yyyy", new Date());
      
      // Determinando o quadro correto com base na situação
      let quadroFinal = values.quadro;
      if (values.situacao === "inativo") {
        // Se for inativo, mover para o quadro de reserva correspondente
        if (quadroFinal === "QOEM" || quadroFinal === "QOE") {
          quadroFinal = "QORR"; // Quadro de Oficiais da Reserva Remunerada
        } else if (quadroFinal === "QPBM") {
          quadroFinal = "QPRR"; // Quadro de Praças da Reserva Remunerada
        }
      }
      
      // Em uma aplicação real, aqui enviaríamos os dados para o backend
      const { data, error } = await supabase
        .from('militares')
        .insert([
          {
            quadro: quadroFinal,
            posto: values.posto,
            nomeCompleto: values.nomeCompleto,
            nomeGuerra: values.nomeGuerra,
            dataNascimento: dataNascimento.toISOString(),
            dataInclusao: dataInclusao.toISOString(),
            dataUltimaPromocao: dataUltimaPromocao.toISOString(),
            situacao: values.situacao,
            email: values.email
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Militar cadastrado com sucesso!",
        description: `${values.nomeCompleto} foi adicionado ao quadro ${quadroFinal}`,
      });
      
      // Determinar para qual página navegar com base no quadro
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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
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
                {/* Data de nascimento - entrada manual */}
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="DD/MM/AAAA" 
                          {...field}
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Data de inclusão - entrada manual */}
                <FormField
                  control={form.control}
                  name="dataInclusao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Inclusão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="DD/MM/AAAA" 
                          {...field}
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Data da última promoção - entrada manual */}
                <FormField
                  control={form.control}
                  name="dataUltimaPromocao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Última Promoção</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="DD/MM/AAAA" 
                          {...field}
                          maxLength={10}
                        />
                      </FormControl>
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
                          defaultValue={field.value}
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
