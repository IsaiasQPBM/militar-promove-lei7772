import React, { useState, useEffect } from "react";
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
import { CursoMilitarTipo, CursoCivilTipo } from "@/types";
import { obterCriteriosLei5461 } from "@/services/promocaoService";
import { Plus } from "lucide-react";

// Esquema para validação de curso militar
const cursoMilitarSchema = z.object({
  nome: z.string().min(2, "Nome do curso é obrigatório"),
  tipo: z.string().min(1, "Tipo de curso é obrigatório"),
  instituicao: z.string().min(2, "Instituição é obrigatória"),
  cargahoraria: z.coerce.number().min(1, "Carga horária deve ser maior que zero"),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

// Esquema para validação de curso civil
const cursoCivilSchema = z.object({
  nome: z.string().min(2, "Nome do curso é obrigatório"),
  tipo: z.string().min(1, "Tipo de curso é obrigatório"),
  instituicao: z.string().min(2, "Instituição é obrigatória"),
  cargahoraria: z.coerce.number().min(1, "Carga horária deve ser maior que zero"),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

// Define interface for curso options
interface CursoOption {
  value: string;
  label: string;
  pontos?: number;
}

type FormacaoEducacionalDialogProps = {
  militarId: string;
  tipo: "militar" | "civil";
  onSuccess: () => void;
};

export function FormacaoEducacionalDialog({ militarId, tipo, onSuccess }: FormacaoEducacionalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOficial, setIsOficial] = useState(false);

  // Obter os critérios da Lei 5.461 para calcular pontos automaticamente
  const criteriosLei5461 = obterCriteriosLei5461();
  
  // Verificar se o militar é um oficial
  useEffect(() => {
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
  
  const formSchema = tipo === "militar" ? cursoMilitarSchema : cursoCivilSchema;
  
  // Definir os tipos de curso disponíveis com base no tipo e se é oficial
  const getTiposCurso = (): CursoOption[] => {
    if (tipo === "militar") {
      if (isOficial) {
        return [
          { value: "Especialização", label: "Especialização (0,5 pontos)", pontos: 0.5 },
          { value: "CSBM", label: "CSBM - Curso Superior de Bombeiro Militar (4,0 pontos)", pontos: 4.0 },
          { value: "CFSD", label: "CFSD - Curso de Formação de Soldados (3,0 pontos)", pontos: 3.0 },
          { value: "CHC", label: "CHC - Curso de Habilitação de Cabos (1,0 ponto)", pontos: 1.0 },
          { value: "CHSGT", label: "CHSGT - Curso de Habilitação de Sargentos (1,5 pontos)", pontos: 1.5 },
          { value: "CAS", label: "CAS - Curso de Aperfeiçoamento de Sargentos (2,0 pontos)", pontos: 2.0 },
          { value: "CHO", label: "CHO - Curso de Habilitação de Oficiais (2,5 pontos)", pontos: 2.5 },
          { value: "CFO", label: "CFO - Curso de Formação de Oficiais (4,0 pontos)", pontos: 4.0 },
          { value: "CAO", label: "CAO - Curso de Aperfeiçoamento de Oficiais (3,0 pontos)", pontos: 3.0 },
          { value: "CSBM2", label: "CSBM2 - Curso Superior de Bombeiro Militar II (3,0 pontos)", pontos: 3.0 },
          { value: "Outro", label: "Outro", pontos: 0 }
        ];
      } else {
        return [
          { value: "Especialização", label: "Especialização" },
          { value: "CFSD", label: "CFSD - Curso de Formação de Soldados" },
          { value: "CHC", label: "CHC - Curso de Habilitação de Cabos" },
          { value: "CHSGT", label: "CHSGT - Curso de Habilitação de Sargentos" },
          { value: "CAS", label: "CAS - Curso de Aperfeiçoamento de Sargentos" },
          { value: "Outro", label: "Outro" }
        ];
      }
    } else {
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      tipo: "",
      instituicao: "",
      cargahoraria: 0,
      pontos: 0
    }
  });
  
  // Função para preencher automaticamente os pontos de acordo com a Lei 5.461
  const atualizarPontos = (tipoCurso: string) => {
    if (!isOficial) return;
    
    const tiposCurso = getTiposCurso();
    const cursoSelecionado = tiposCurso.find(curso => curso.value === tipoCurso);
    
    if (cursoSelecionado && cursoSelecionado.pontos !== undefined) {
      form.setValue("pontos", cursoSelecionado.pontos);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const tabela = tipo === "militar" ? "cursos_militares" : "cursos_civis";
      
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
      console.error(`Erro ao adicionar curso ${tipo}:`, error);
      toast({
        title: `Erro ao adicionar curso ${tipo}`,
        description: error.message || `Ocorreu um erro ao adicionar o curso ${tipo}.`,
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
          <Plus size={16} className="mr-1" /> {tipo === "militar" ? "Adicionar Curso Militar" : "Adicionar Curso Civil"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tipo === "militar" ? "Novo Curso Militar" : "Novo Curso Civil"}</DialogTitle>
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
                    <Input placeholder="Digite o nome do curso" {...field} />
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
                        <SelectValue placeholder="Selecione o tipo de curso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getTiposCurso().map(opcao => (
                        <SelectItem key={opcao.value} value={opcao.value}>
                          {opcao.label}
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
                    <Input placeholder="Digite a instituição" {...field} />
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
                      <Input type="number" {...field} />
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
