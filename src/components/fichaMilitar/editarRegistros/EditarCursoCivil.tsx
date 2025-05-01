
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CursoCivil } from "@/types";
import { PlusCircle, Save, X, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type EditarCursoCivilProps = {
  militarId: string;
  cursos: CursoCivil[];
  onCancel: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
};

const EditarCursoCivil = ({ 
  militarId,
  cursos,
  onCancel,
  onSave,
  onDelete
}: EditarCursoCivilProps) => {
  const [editableCursos, setEditableCursos] = useState<CursoCivil[]>(cursos);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (id: string, field: keyof CursoCivil, value: any) => {
    setEditableCursos(cursos => 
      cursos.map(curso => 
        curso.id === id ? { ...curso, [field]: value } : curso
      )
    );
  };

  const addNovoCurso = () => {
    const novoCurso: CursoCivil = {
      id: `temp-${Date.now()}`,
      militarId,
      nome: "",
      instituicao: "",
      cargaHoraria: 0,
      pontos: 0,
      anexo: null
    };
    
    setEditableCursos([...editableCursos, novoCurso]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validar os dados
      const camposInvalidos = editableCursos.filter(curso => 
        !curso.nome || !curso.instituicao || !curso.cargaHoraria
      );
      
      if (camposInvalidos.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }
      
      // Separar cursos existentes e novos
      const cursosExistentes = editableCursos.filter(curso => !curso.id.startsWith('temp-'));
      const cursosNovos = editableCursos.filter(curso => curso.id.startsWith('temp-'));
      
      // Atualizar cursos existentes
      for (const curso of cursosExistentes) {
        const { error } = await supabase
          .from('cursos_civis')
          .update({
            nome: curso.nome,
            instituicao: curso.instituicao,
            cargahoraria: curso.cargaHoraria,
            pontos: curso.pontos
          })
          .eq('id', curso.id);
          
        if (error) throw error;
      }
      
      // Inserir novos cursos
      if (cursosNovos.length > 0) {
        const { error } = await supabase
          .from('cursos_civis')
          .insert(
            cursosNovos.map(curso => ({
              militar_id: militarId,
              nome: curso.nome,
              instituicao: curso.instituicao,
              cargahoraria: curso.cargaHoraria,
              pontos: curso.pontos
            }))
          );
          
        if (error) throw error;
      }
      
      toast({
        title: "Cursos civis atualizados",
        description: "Os cursos foram salvos com sucesso"
      });
      
      onSave();
      
    } catch (error: any) {
      console.error("Erro ao salvar cursos:", error);
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
              <th className="p-2 text-left">Curso</th>
              <th className="p-2 text-left">Instituição</th>
              <th className="p-2 text-left">Carga Horária (h)</th>
              <th className="p-2 text-left">Pontos</th>
              <th className="p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {editableCursos.map((curso) => (
              <tr key={curso.id} className="border-b">
                <td className="p-2">
                  <Input
                    value={curso.nome}
                    onChange={(e) => handleInputChange(curso.id, 'nome', e.target.value)}
                    placeholder="Nome do curso"
                    className="h-8"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={curso.instituicao}
                    onChange={(e) => handleInputChange(curso.id, 'instituicao', e.target.value)}
                    placeholder="Instituição"
                    className="h-8"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={curso.cargaHoraria}
                    onChange={(e) => handleInputChange(curso.id, 'cargaHoraria', Number(e.target.value))}
                    placeholder="Carga horária"
                    className="h-8"
                    min={0}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={curso.pontos}
                    onChange={(e) => handleInputChange(curso.id, 'pontos', Number(e.target.value))}
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
                      if (curso.id.startsWith('temp-')) {
                        setEditableCursos(editableCursos.filter(c => c.id !== curso.id));
                      } else {
                        onDelete(curso.id);
                        setEditableCursos(editableCursos.filter(c => c.id !== curso.id));
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
          onClick={addNovoCurso}
        >
          <PlusCircle className="h-4 w-4" /> Adicionar curso
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

export default EditarCursoCivil;
