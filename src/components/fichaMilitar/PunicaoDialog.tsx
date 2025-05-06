
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
import { Plus } from "lucide-react";

// Esquema para validação de punição
const punicaoSchema = z.object({
  tipo: z.enum(["Repreensão", "Detenção", "Prisão"]),
  descricao: z.string().min(2, "Descrição é obrigatória"),
  datarecebimento: z.string().refine(val => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: "Data inválida. Use o formato DD/MM/AAAA"
  }),
  pontos: z.coerce.number().min(0, "Pontos não podem ser negativos")
});

type PunicaoDialogProps = {
  militarId: string;
  onSuccess: () => void;
};

export function PunicaoDialog({ militarId, onSuccess }: PunicaoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof punicaoSchema>>({
    resolver: zodResolver(punicaoSchema),
    defaultValues: {
      tipo: "Repreensão",
      descricao: "",
      datarecebimento: "",
      pontos: 0
    }
  });
  
  const onSubmit = async (values: z.infer<typeof punicaoSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Formatar a data para o formato ISO
      const dataParts = values.datarecebimento.split('/');
      const dataFormatada = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;
      
      const { error } = await supabase
        .from("punicoes")
        .insert({
          militar_id: militarId,
          tipo: values.tipo,
          descricao: values.descricao,
          datarecebimento: dataFormatada,
          pontos: values.pontos
        });
        
      if (error) throw error;
      
      toast({
        title: "Punição adicionada com sucesso!",
        description: "O registro de punição foi adicionado à ficha do militar."
      });
      
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao adicionar punição:", error);
      toast({
        title: "Erro ao adicionar punição",
        description: error.message || "Ocorreu um erro ao adicionar o registro de punição.",
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
          <Plus size={16} className="mr-1" /> Adicionar Punição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Punição</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Punição</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Repreensão">Repreensão</SelectItem>
                      <SelectItem value="Detenção">Detenção</SelectItem>
                      <SelectItem value="Prisão">Prisão</SelectItem>
                    </SelectContent>
                  </Select>
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
                      placeholder="Descreva a punição" 
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
                    <FormLabel>Data da Punição</FormLabel>
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
                      <Input type="number" step="0.1" {...field} />
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
