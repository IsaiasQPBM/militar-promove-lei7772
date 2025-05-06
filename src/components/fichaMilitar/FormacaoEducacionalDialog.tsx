
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Esquema para validação de curso militar
const cursoMilitarSchema = z.object({
  nome: z.string().min(2, "Nome do curso é obrigatório"),
  tipo: z.string().min(1, "Selecione o tipo de curso"),
  instituicao: z.string().min(2, "Nome da instituição é obrigatório"),
  cargahoraria: z.coerce.number().min(1, "Carga horária deve ser maior que zero"),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

// Esquema para validação de curso civil
const cursoCivilSchema = z.object({
  nome: z.string().min(2, "Nome do curso é obrigatório"),
  tipo: z.string().min(1, "Selecione o tipo de curso"),
  instituicao: z.string().min(2, "Nome da instituição é obrigatório"),
  cargahoraria: z.coerce.number().min(1, "Carga horária deve ser maior que zero"),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

type FormacaoEducacionalDialogProps = {
  militarId: string;
  tipo: "militar" | "civil";
  onSuccess: () => void;
};

const tiposCursoMilitar = [
  { value: "Formação", label: "Curso de Formação" },
  { value: "Aperfeiçoamento", label: "Curso de Aperfeiçoamento" },
  { value: "Especialização", label: "Curso de Especialização" },
  { value: "Altos Estudos", label: "Curso de Altos Estudos" },
  { value: "Mestrado", label: "Mestrado" },
  { value: "Doutorado", label: "Doutorado" },
  { value: "Outro", label: "Outro" }
];

const tiposCursoCivil = [
  { value: "Técnico", label: "Curso Técnico" },
  { value: "Graduação", label: "Graduação" },
  { value: "Pós-Graduação", label: "Pós-Graduação" },
  { value: "MBA", label: "MBA" },
  { value: "Mestrado", label: "Mestrado" },
  { value: "Doutorado", label: "Doutorado" },
  { value: "Curso Livre", label: "Curso Livre" },
  { value: "Outro", label: "Outro" }
];

export function FormacaoEducacionalDialog({ militarId, tipo, onSuccess }: FormacaoEducacionalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const schema = tipo === "militar" ? cursoMilitarSchema : cursoCivilSchema;
  const tiposCurso = tipo === "militar" ? tiposCursoMilitar : tiposCursoCivil;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      tipo: tipo === "militar" ? "Especialização" : "Graduação",
      instituicao: "",
      cargahoraria: 0,
      pontos: 0
    }
  });
  
  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsSubmitting(true);
      
      const table = tipo === "militar" ? "cursos_militares" : "cursos_civis";
      
      const { error } = await supabase
        .from(table)
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
        title: "Erro ao adicionar curso",
        description: error.message || "Ocorreu um erro ao adicionar o curso.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const buttonLabel = tipo === "militar" 
    ? "Adicionar Curso Militar" 
    : "Adicionar Curso Civil";
    
  const dialogTitle = tipo === "militar"
    ? "Novo Curso Militar"
    : "Novo Curso Civil";
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de curso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposCurso.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
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
                    <FormLabel>Carga Horária (h)</FormLabel>
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
                      <Input type="number" {...field} />
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
