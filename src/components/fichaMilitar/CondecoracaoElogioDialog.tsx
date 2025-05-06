
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

// Esquema para validação de condecoração
const condecoracaoSchema = z.object({
  tipo: z.string().min(2, "Tipo é obrigatório"),
  descricao: z.string().min(2, "Descrição é obrigatória"),
  datarecebimento: z.string().refine(val => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: "Data inválida. Use o formato DD/MM/AAAA"
  }),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

// Esquema para validação de elogio
const elogioSchema = z.object({
  tipo: z.enum(["Individual", "Coletivo"]),
  descricao: z.string().min(2, "Descrição é obrigatória"),
  datarecebimento: z.string().refine(val => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: "Data inválida. Use o formato DD/MM/AAAA"
  }),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

type CondecoracaoElogioDialogProps = {
  militarId: string;
  tipo: "condecoracao" | "elogio";
  onSuccess: () => void;
};

const tiposCondecoracao = [
  { value: "Medalha de Bravura", label: "Medalha de Bravura" },
  { value: "Medalha de Mérito", label: "Medalha de Mérito" },
  { value: "Medalha de Tempo de Serviço", label: "Medalha de Tempo de Serviço" },
  { value: "Medalha de Honra ao Mérito", label: "Medalha de Honra ao Mérito" },
  { value: "Comenda", label: "Comenda" },
  { value: "Outro", label: "Outro" }
];

export function CondecoracaoElogioDialog({ militarId, tipo, onSuccess }: CondecoracaoElogioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const schema = tipo === "condecoracao" ? condecoracaoSchema : elogioSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: tipo === "condecoracao" ? "Medalha de Mérito" : "Individual",
      descricao: "",
      datarecebimento: "",
      pontos: 0
    }
  });
  
  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsSubmitting(true);
      
      // Formatar a data para o formato ISO
      const dataParts = values.datarecebimento.split('/');
      const dataFormatada = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;
      
      const table = tipo === "condecoracao" ? "condecoracoes" : "elogios";
      
      const { error } = await supabase
        .from(table)
        .insert({
          militar_id: militarId,
          tipo: values.tipo,
          descricao: values.descricao,
          datarecebimento: dataFormatada,
          pontos: values.pontos
        });
        
      if (error) throw error;
      
      toast({
        title: tipo === "condecoracao" ? "Condecoração adicionada com sucesso!" : "Elogio adicionado com sucesso!",
        description: `O registro foi adicionado à ficha do militar.`
      });
      
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error(`Erro ao adicionar ${tipo}:`, error);
      toast({
        title: `Erro ao adicionar ${tipo === "condecoracao" ? "condecoração" : "elogio"}`,
        description: error.message || "Ocorreu um erro ao adicionar o registro.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const buttonLabel = tipo === "condecoracao" 
    ? "Adicionar Condecoração" 
    : "Adicionar Elogio";
    
  const dialogTitle = tipo === "condecoracao"
    ? "Nova Condecoração"
    : "Novo Elogio";
  
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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  {tipo === "condecoracao" ? (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposCondecoracao.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Coletivo">Coletivo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`Descrição ${tipo === "condecoracao" ? "da condecoração" : "do elogio"}`} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="datarecebimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Recebimento</FormLabel>
                    <FormControl>
                      <Input placeholder="DD/MM/AAAA" {...field} maxLength={10} />
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
