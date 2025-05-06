
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { obterCriteriosLei5461 } from "@/services/promocaoService";
import { Plus } from "lucide-react";

// Esquema para validação de condecoração/elogio
const condecoracaoElogioSchema = z.object({
  tipo: z.string().min(1, "Tipo é obrigatório"),
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

export function CondecoracaoElogioDialog({ militarId, tipo, onSuccess }: CondecoracaoElogioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOficial, setIsOficial] = useState(false);
  
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
  
  const form = useForm<z.infer<typeof condecoracaoElogioSchema>>({
    resolver: zodResolver(condecoracaoElogioSchema),
    defaultValues: {
      tipo: "",
      descricao: "",
      datarecebimento: "",
      pontos: 0
    }
  });
  
  // Funções para obter os tipos disponíveis baseado na categoria
  const getTiposDisponiveis = () => {
    if (tipo === "condecoracao") {
      if (isOficial) {
        return [
          { value: "Governo Federal", label: "Governo Federal (1,0 ponto)", pontos: 1.0 },
          { value: "Governo Estadual", label: "Governo Estadual (0,5 pontos)", pontos: 0.5 },
          { value: "CBMEPI", label: "CBMEPI (0,2 pontos)", pontos: 0.2 },
          { value: "Outro", label: "Outro", pontos: 0 }
        ];
      } else {
        return [
          { value: "Governo Federal", label: "Governo Federal" },
          { value: "Governo Estadual", label: "Governo Estadual" },
          { value: "CBMEPI", label: "CBMEPI" },
          { value: "Outro", label: "Outro" }
        ];
      }
    } else {
      // Elogios
      if (isOficial) {
        return [
          { value: "Individual", label: "Individual (0,2 pontos)", pontos: 0.2 },
          { value: "Coletivo", label: "Coletivo (0,1 pontos)", pontos: 0.1 },
          { value: "Outro", label: "Outro", pontos: 0 }
        ];
      } else {
        return [
          { value: "Individual", label: "Individual" },
          { value: "Coletivo", label: "Coletivo" },
          { value: "Outro", label: "Outro" }
        ];
      }
    }
  };
  
  // Função para atualizar pontos automaticamente com base no tipo selecionado
  const atualizarPontos = (tipoSelecionado: string) => {
    if (!isOficial) return;
    
    const tipos = getTiposDisponiveis();
    const tipo = tipos.find(t => t.value === tipoSelecionado);
    
    if (tipo) {
      form.setValue("pontos", tipo.pontos || 0);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof condecoracaoElogioSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Formatar a data para o formato ISO
      const dataParts = values.datarecebimento.split('/');
      const dataFormatada = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;
      
      const tabela = tipo === "condecoracao" ? "condecoracoes" : "elogios";
      
      const { error } = await supabase
        .from(tabela)
        .insert({
          militar_id: militarId,
          tipo: values.tipo,
          descricao: values.descricao,
          datarecebimento: dataFormatada,
          pontos: values.pontos
        });
        
      if (error) throw error;
      
      toast({
        title: `${tipo === "condecoracao" ? "Condecoração" : "Elogio"} adicionado com sucesso!`,
        description: `O registro foi adicionado à ficha do militar.`
      });
      
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error(`Erro ao adicionar ${tipo}:`, error);
      toast({
        title: `Erro ao adicionar ${tipo === "condecoracao" ? "condecoração" : "elogio"}`,
        description: error.message || `Ocorreu um erro ao adicionar o registro.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1">
          <Plus size={16} /> {tipo === "condecoracao" ? "Adicionar Condecoração" : "Adicionar Elogio"}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tipo === "condecoracao" ? "Nova Condecoração" : "Novo Elogio"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
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
                      {getTiposDisponiveis().map(opcao => (
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
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`Descreva a ${tipo === "condecoracao" ? "condecoração" : "elogio"}`} 
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
