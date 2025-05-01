
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Punicao } from "@/types";
import { PlusCircle, Save, X, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parse } from "date-fns";

type EditarPunicaoProps = {
  militarId: string;
  punicoes: Punicao[];
  onCancel: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
};

const EditarPunicao = ({ 
  militarId,
  punicoes,
  onCancel,
  onSave,
  onDelete
}: EditarPunicaoProps) => {
  const [editablePunicoes, setEditablePunicoes] = useState<Punicao[]>(
    punicoes.map(p => ({
      ...p,
      dataRecebimento: p.dataRecebimento 
        ? format(new Date(p.dataRecebimento), 'dd/MM/yyyy')
        : ''
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (id: string, field: keyof Punicao, value: any) => {
    setEditablePunicoes(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addNovoItem = () => {
    const novoItem: Punicao = {
      id: `temp-${Date.now()}`,
      militarId,
      tipo: "Repreensão",
      descricao: "",
      pontos: 0,
      dataRecebimento: format(new Date(), 'dd/MM/yyyy'),
      anexo: null
    };
    
    setEditablePunicoes([...editablePunicoes, novoItem]);
  };

  const isValidDate = (dateStr: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    
    try {
      const date = parse(dateStr, 'dd/MM/yyyy', new Date());
      return date instanceof Date && !isNaN(date.getTime());
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validar os dados
      const camposInvalidos = editablePunicoes.filter(item => 
        !item.tipo || !item.descricao || !item.dataRecebimento || !isValidDate(item.dataRecebimento as string)
      );
      
      if (camposInvalidos.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios corretamente. Verifique o formato da data (DD/MM/AAAA).",
          variant: "destructive"
        });
        return;
      }
      
      // Separar itens existentes e novos
      const existentes = editablePunicoes.filter(item => !item.id.startsWith('temp-'));
      const novos = editablePunicoes.filter(item => item.id.startsWith('temp-'));
      
      // Atualizar itens existentes
      for (const item of existentes) {
        const { error } = await supabase
          .from('punicoes')
          .update({
            tipo: item.tipo,
            descricao: item.descricao,
            pontos: item.pontos,
            datarecebimento: parse(item.dataRecebimento as string, 'dd/MM/yyyy', new Date()).toISOString().split('T')[0]
          })
          .eq('id', item.id);
          
        if (error) throw error;
      }
      
      // Inserir novos itens
      if (novos.length > 0) {
        const { error } = await supabase
          .from('punicoes')
          .insert(
            novos.map(item => ({
              militar_id: militarId,
              tipo: item.tipo,
              descricao: item.descricao,
              pontos: item.pontos,
              datarecebimento: parse(item.dataRecebimento as string, 'dd/MM/yyyy', new Date()).toISOString().split('T')[0]
            }))
          );
          
        if (error) throw error;
      }
      
      toast({
        title: "Punições atualizadas",
        description: "As punições foram salvas com sucesso"
      });
      
      onSave();
      
    } catch (error: any) {
      console.error("Erro ao salvar punições:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">Descrição</th>
              <th className="p-2 text-left">Data</th>
              <th className="p-2 text-left">Pontos</th>
              <th className="p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {editablePunicoes.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">
                  <Select 
                    value={item.tipo} 
                    onValueChange={(value) => handleInputChange(item.id, 'tipo', value as "Repreensão" | "Detenção" | "Prisão")}
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Repreensão">Repreensão</SelectItem>
                      <SelectItem value="Detenção">Detenção</SelectItem>
                      <SelectItem value="Prisão">Prisão</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Textarea
                    value={item.descricao}
                    onChange={(e) => handleInputChange(item.id, 'descricao', e.target.value)}
                    placeholder="Descrição"
                    className="h-16"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={item.dataRecebimento as string}
                    onChange={(e) => handleInputChange(item.id, 'dataRecebimento', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="h-8"
                    maxLength={10}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={item.pontos}
                    onChange={(e) => handleInputChange(item.id, 'pontos', Number(e.target.value))}
                    placeholder="Pontos"
                    className="h-8"
                    min={0}
                    step={0.1}
                  />
                </td>
                <td className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => {
                      if (item.id.startsWith('temp-')) {
                        setEditablePunicoes(items => items.filter(c => c.id !== item.id));
                      } else {
                        onDelete(item.id);
                        setEditablePunicoes(items => items.filter(c => c.id !== item.id));
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={addNovoItem}
        >
          <PlusCircle className="h-4 w-4" /> Adicionar punição
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onCancel}
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1 bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditarPunicao;
