
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  EditarCursoMilitar,
  EditarCursoCivil,
  EditarCondecoracao,
  EditarElogio,
  EditarPunicao
} from "@/components/fichaMilitar/editarRegistros";
import { supabase } from "@/integrations/supabase/client";

type DadosFormacaoProps = {
  militarId: string;
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
  onDataChange: () => void;
};

export const DadosFormacao = ({ 
  militarId,
  cursosMilitares, 
  cursosCivis,
  condecoracoes,
  elogios,
  punicoes,
  onDataChange
}: DadosFormacaoProps) => {
  const [editandoCursosMilitares, setEditandoCursosMilitares] = useState(false);
  const [editandoCursosCivis, setEditandoCursosCivis] = useState(false);
  const [editandoCondecoracoes, setEditandoCondecoracoes] = useState(false);
  const [editandoElogios, setEditandoElogios] = useState(false);
  const [editandoPunicoes, setEditandoPunicoes] = useState(false);

  // Função para excluir um item
  const excluirRegistro = async (
    tabela: string, 
    id: string, 
    onSuccess: () => void,
    tipoRegistro: string
  ) => {
    try {
      const { error } = await supabase
        .from(tabela)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: `${tipoRegistro} excluído com sucesso!`,
        variant: "default"
      });
      
      onSuccess();
      onDataChange();
      
    } catch (error: any) {
      toast({
        title: `Erro ao excluir ${tipoRegistro.toLowerCase()}`,
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <TabsContent value="cursos-militares" className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cursos Militares</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setEditandoCursosMilitares(true)}
          >
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </div>
        
        {editandoCursosMilitares ? (
          <EditarCursoMilitar
            militarId={militarId}
            cursos={cursosMilitares}
            onCancel={() => setEditandoCursosMilitares(false)}
            onSave={() => {
              setEditandoCursosMilitares(false);
              onDataChange();
            }}
            onDelete={(id) => excluirRegistro(
              'cursos_militares', 
              id, 
              () => {}, 
              'Curso militar'
            )}
          />
        ) : (
          cursosMilitares.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Curso</th>
                    <th className="p-2 text-left">Instituição</th>
                    <th className="p-2 text-left">Carga Horária</th>
                    <th className="p-2 text-left">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {cursosMilitares.map((curso) => (
                    <tr key={curso.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{curso.nome}</td>
                      <td className="p-2">{curso.instituicao}</td>
                      <td className="p-2">{curso.cargaHoraria}h</td>
                      <td className="p-2 font-bold">{curso.pontos}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                    <td className="p-2 font-bold">{cursosMilitares.reduce((sum, curso) => sum + (curso.pontos || 0), 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">Não há cursos militares registrados.</div>
          )
        )}
      </TabsContent>
      
      <TabsContent value="cursos-civis" className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cursos Civis</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setEditandoCursosCivis(true)}
          >
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </div>
        
        {editandoCursosCivis ? (
          <EditarCursoCivil
            militarId={militarId}
            cursos={cursosCivis}
            onCancel={() => setEditandoCursosCivis(false)}
            onSave={() => {
              setEditandoCursosCivis(false);
              onDataChange();
            }}
            onDelete={(id) => excluirRegistro(
              'cursos_civis', 
              id, 
              () => {}, 
              'Curso civil'
            )}
          />
        ) : (
          cursosCivis.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Curso</th>
                    <th className="p-2 text-left">Instituição</th>
                    <th className="p-2 text-left">Carga Horária</th>
                    <th className="p-2 text-left">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {cursosCivis.map((curso) => (
                    <tr key={curso.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{curso.nome}</td>
                      <td className="p-2">{curso.instituicao}</td>
                      <td className="p-2">{curso.cargaHoraria}h</td>
                      <td className="p-2 font-bold">{curso.pontos}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                    <td className="p-2 font-bold">{cursosCivis.reduce((sum, curso) => sum + (curso.pontos || 0), 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">Não há cursos civis registrados.</div>
          )
        )}
      </TabsContent>
      
      <TabsContent value="condecoracoes" className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Condecorações</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setEditandoCondecoracoes(true)}
          >
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </div>
        
        {editandoCondecoracoes ? (
          <EditarCondecoracao
            militarId={militarId}
            condecoracoes={condecoracoes}
            onCancel={() => setEditandoCondecoracoes(false)}
            onSave={() => {
              setEditandoCondecoracoes(false);
              onDataChange();
            }}
            onDelete={(id) => excluirRegistro(
              'condecoracoes', 
              id, 
              () => {}, 
              'Condecoração'
            )}
          />
        ) : (
          condecoracoes.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Descrição</th>
                    <th className="p-2 text-left">Data</th>
                    <th className="p-2 text-left">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {condecoracoes.map((cond) => (
                    <tr key={cond.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{cond.tipo}</td>
                      <td className="p-2">{cond.descricao}</td>
                      <td className="p-2">{cond.dataRecebimento && format(new Date(cond.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</td>
                      <td className="p-2 font-bold">{cond.pontos}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                    <td className="p-2 font-bold">{condecoracoes.reduce((sum, cond) => sum + (cond.pontos || 0), 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">Não há condecorações registradas.</div>
          )
        )}
      </TabsContent>
      
      <TabsContent value="elogios" className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Elogios</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setEditandoElogios(true)}
          >
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </div>
        
        {editandoElogios ? (
          <EditarElogio
            militarId={militarId}
            elogios={elogios}
            onCancel={() => setEditandoElogios(false)}
            onSave={() => {
              setEditandoElogios(false);
              onDataChange();
            }}
            onDelete={(id) => excluirRegistro(
              'elogios', 
              id, 
              () => {}, 
              'Elogio'
            )}
          />
        ) : (
          elogios.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Descrição</th>
                    <th className="p-2 text-left">Data</th>
                    <th className="p-2 text-left">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {elogios.map((elogio) => (
                    <tr key={elogio.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{elogio.tipo}</td>
                      <td className="p-2">{elogio.descricao}</td>
                      <td className="p-2">{elogio.dataRecebimento && format(new Date(elogio.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</td>
                      <td className="p-2 font-bold">{elogio.pontos}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                    <td className="p-2 font-bold">{elogios.reduce((sum, elogio) => sum + (elogio.pontos || 0), 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">Não há elogios registrados.</div>
          )
        )}
      </TabsContent>
      
      <TabsContent value="punicoes" className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Punições</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setEditandoPunicoes(true)}
          >
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </div>
        
        {editandoPunicoes ? (
          <EditarPunicao
            militarId={militarId}
            punicoes={punicoes}
            onCancel={() => setEditandoPunicoes(false)}
            onSave={() => {
              setEditandoPunicoes(false);
              onDataChange();
            }}
            onDelete={(id) => excluirRegistro(
              'punicoes', 
              id, 
              () => {}, 
              'Punição'
            )}
          />
        ) : (
          punicoes.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Descrição</th>
                    <th className="p-2 text-left">Data</th>
                    <th className="p-2 text-left">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {punicoes.map((punicao) => (
                    <tr key={punicao.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{punicao.tipo}</td>
                      <td className="p-2">{punicao.descricao}</td>
                      <td className="p-2">{punicao.dataRecebimento && format(new Date(punicao.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</td>
                      <td className="p-2 font-bold text-red-500">{punicao.pontos}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                    <td className="p-2 font-bold text-red-500">{punicoes.reduce((sum, punicao) => sum + (punicao.pontos || 0), 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">Não há punições registradas.</div>
          )
        )}
      </TabsContent>
    </>
  );
};
