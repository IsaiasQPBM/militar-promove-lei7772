
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TabsContent } from "@/components/ui/tabs";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";

type DadosFormacaoProps = {
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
};

export const DadosFormacao = ({ 
  cursosMilitares, 
  cursosCivis,
  condecoracoes,
  elogios,
  punicoes
}: DadosFormacaoProps) => {
  return (
    <>
      <TabsContent value="cursos-militares" className="p-4">
        {cursosMilitares.length > 0 ? (
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
        )}
      </TabsContent>
      
      <TabsContent value="cursos-civis" className="p-4">
        {cursosCivis.length > 0 ? (
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
        )}
      </TabsContent>
      
      <TabsContent value="condecoracoes" className="p-4">
        {condecoracoes.length > 0 ? (
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
        )}
      </TabsContent>
      
      <TabsContent value="elogios" className="p-4">
        {elogios.length > 0 ? (
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
        )}
      </TabsContent>
      
      <TabsContent value="punicoes" className="p-4">
        {punicoes.length > 0 ? (
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
        )}
      </TabsContent>
    </>
  );
};
