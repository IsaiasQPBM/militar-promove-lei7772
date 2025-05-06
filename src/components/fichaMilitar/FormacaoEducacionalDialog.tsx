
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { obterCriteriosLei5461 } from "@/services/promocaoService";

// Esquema para validação de curso
const cursoSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  instituicao: z.string().min(2, "Instituição é obrigatória"),
  cargahoraria: z.coerce.number().min(1, "Carga horária deve ser maior que zero"),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

type FormacaoEducacionalDialogProps = {
  militarId: string;
  formacaoTipo: "cursos_militares" | "cursos_civis";
  onSuccess: () => void;
};

export function FormacaoEducacionalDialog({ militarId, formacaoTipo, onSuccess }: FormacaoEducacionalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOficial, setIsOficial] = useState(false);
  
  // Verificar se o militar é um oficial
  React.useEffect(() => {
    const verificarQuadroMilitar = async () => {
      try {
        const { data, error } = await supabase
          .from("militares")
          .select("posto, quadro")
          .eq("id", militarId)
          .single();
          
        if (error) throw error;
        
        // Verificar se é um oficial
        if (data) {
          const postosOficial = ["Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente"];
          setIsOficial(postosOficial.includes(data.posto));
        }
      } catch (error) {
        console.error("Erro ao verificar posto do militar:", error);
      }
    };
    
    if (militarId) {
      verificarQuadroMilitar();
    }
  }, [militarId]);
  
  const form = useForm<z.infer<typeof cursoSchema>>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      nome: "",
      tipo: "",
      instituicao: "",
      cargahoraria: 0,
      pontos: 0
    }
  });
  
  // Opções para o tipo de curso baseado no formacaoTipo
  const getTipoOptions = () => {
    if (formacaoTipo === "cursos_militares") {
      if (isOficial) {
        return [
          { value: "Especialização", label: "Especialização (0,5 pontos)", pontos: 0.5 },
          { value: "CSBM", label: "CSBM (4,0 pontos)", pontos: 4.0 },
          { value: "CFSD", label: "CFSD (3,0 pontos)", pontos: 3.0 },
          { value: "CHC", label: "CHC (1,0 ponto)", pontos: 1.0 },
          { value: "CHSGT", label: "CHSGT (1,5 pontos)", pontos: 1.5 },
          { value: "CAS", label: "CAS (2,0 pontos)", pontos: 2.0 },
          { value: "CHO", label: "CHO (2,5 pontos)", pontos: 2.5 },
          { value: "CFO", label: "CFO (4,0 pontos)", pontos: 4.0 },
          { value: "CAO", label: "CAO (3,0 pontos)", pontos: 3.0 },
          { value: "CSBM2", label: "CSBM2 (3,0 pontos)", pontos: 3.0 },
          { value: "Outro", label: "Outro", pontos: 0 }
        ];
      } else {
        return [
          { value: "Especialização", label: "Especialização" },
          { value: "CSBM", label: "CSBM" },
          { value: "CFSD", label: "CFSD" },
          { value: "CHC", label: "CHC" },
          { value: "CHSGT", label: "CHSGT" },
          { value: "CAS", label: "CAS" },
          { value: "CHO", label: "CHO" },
          { value: "CFO", label: "CFO" },
          { value: "CAO", label: "CAO" },
          { value: "CSBM2", label: "CSBM2" },
          { value: "Outro", label: "Outro" }
        ];
      }
    } else {
      // Cursos civis
      if (isOficial) {
        return [
          { value: "Superior", label: "Superior (1,0 ponto)", pontos: 1.0 },
          { value: "Especialização", label: "Especialização (1,0 ponto)", pontos: 1.0 },
          { value: "Mestrado", label: "Mestrado (2,0 pontos)", pontos: 2.0 },
          { value: "Doutorado", label: "Doutorado (3,0 pontos)", pontos: 3.0 },
          { value: "Outro", label: "Outro", pontos: 0 }
        ];
      } else {
        return [
          { value: "Superior", label: "Superior" },
          { value: "Especialização", label: "Especialização" },
          { value: "Mestrado", label: "Mestrado" },
          { value: "Doutorado", label: "Doutorado" },
          { value: "Outro", label: "Outro" }
        ];
      }
    }
  };
  
  // Atualizar pontos automaticamente ao selecionar o tipo de curso
  const atualizarPontos = (tipoSelecionado: string) => {
    if (!isOficial) return;
    
    const opcoes = getTipoOptions();
    const opcao = opcoes.find(o => o.value === tipoSelecionado);
    
    if (opcao && opcao.pontos !== undefined) {
      form.setValue("pontos", opcao.pontos);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof cursoSchema>) => {
    try {
      setIsSubmitting(true);
      
      const tabela = formacaoTipo === "cursos_militares" ? "cursos_militares" : "cursos_civis";
      
      const { error } = await supabase
        .from(tabela)
        .insert({
          militar_id: militarId,
          nome: values.nome,
          tipo: values.tipo,
          instituicao: values.instituicao,
          cargahoraria: values.cargahoraria,
          pontos: values.pontos
        });
        
      if (error) throw error;
      
      toast({
        title: "Curso adicionado com sucesso!",
        description: `O curso ${values.nome} foi adicionado à ficha do militar.`
      });
      
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao adicionar curso:", error);
      toast({
        title: "Erro ao adicionar curso",
        description: error.message || "Ocorreu um erro ao adicionar o curso.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="w-full">
          <Plus size={16} className="mr-1" /> 
          Adicionar {formacaoTipo === "cursos_militares" ? "Curso Militar" : "Curso Civil"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Novo {formacaoTipo === "cursos_militares" ? "Curso Militar" : "Curso Civil"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Curso</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Curso</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      atualizarPontos(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getTipoOptions().map((option) => (
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
            
            <FormField
              control={form.control}
              name="instituicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instituição</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da instituição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cargahoraria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga Horária</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pontos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        disabled={isOficial && form.getValues("tipo") !== "Outro"} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
