
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMilitarById, mockCursosMilitares, mockCursosCivis, mockCondecoracoes, mockElogios, mockPunicoes } from "@/utils/mockData";
import { Militar, CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const FichaMilitar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [militar, setMilitar] = useState<Militar | null>(null);
  const [cursosMilitares, setCursosMilitares] = useState<CursoMilitar[]>([]);
  const [cursosCivis, setCursosCivis] = useState<CursoCivil[]>([]);
  const [condecoracoes, setCondecoracoes] = useState<Condecoracao[]>([]);
  const [elogios, setElogios] = useState<Elogio[]>([]);
  const [punicoes, setPunicoes] = useState<Punicao[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);
  
  useEffect(() => {
    if (id) {
      // Obter dados do militar
      const militarData = getMilitarById(id);
      if (militarData) {
        setMilitar(militarData);
      }
      
      // Obter cursos militares
      const cursosMilitaresData = mockCursosMilitares.filter(curso => curso.militarId === id);
      setCursosMilitares(cursosMilitaresData);
      
      // Obter cursos civis
      const cursosCivisData = mockCursosCivis.filter(curso => curso.militarId === id);
      setCursosCivis(cursosCivisData);
      
      // Obter condecorações
      const condecoracoesData = mockCondecoracoes.filter(cond => cond.militarId === id);
      setCondecoracoes(condecoracoesData);
      
      // Obter elogios
      const elogiosData = mockElogios.filter(elogio => elogio.militarId === id);
      setElogios(elogiosData);
      
      // Obter punições
      const punicoesData = mockPunicoes.filter(punicao => punicao.militarId === id);
      setPunicoes(punicoesData);
      
      // Calcular total de pontos
      const pontosM = cursosMilitaresData.reduce((sum, curso) => sum + curso.pontos, 0);
      const pontosC = cursosCivisData.reduce((sum, curso) => sum + curso.pontos, 0);
      const pontosD = condecoracoesData.reduce((sum, cond) => sum + cond.pontos, 0);
      const pontosE = elogiosData.reduce((sum, elogio) => sum + elogio.pontos, 0);
      const pontosP = punicoesData.reduce((sum, punicao) => sum + punicao.pontos, 0);
      
      setTotalPontos(pontosM + pontosC + pontosD + pontosE - pontosP);
    }
  }, [id]);
  
  if (!militar) {
    return <div className="flex justify-center items-center h-64">Carregando dados do militar...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ficha Individual do Militar</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(`/militar/${id}/editar`)}
            variant="outline"
          >
            Editar Dados
          </Button>
          <Button
            onClick={() => navigate(`/militar/${id}/promocoes`)}
            variant="outline"
          >
            Histórico de Promoções
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </div>
      
      {/* Dados do Militar */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center space-y-3">
              <Avatar className="h-32 w-32">
                <AvatarImage src={militar.foto || ""} />
                <AvatarFallback className="text-3xl">{militar.nomeGuerra.charAt(0)}</AvatarFallback>
              </Avatar>
              <Badge className={militar.situacao === "ativo" ? "bg-green-600" : "bg-orange-500"}>
                {militar.situacao === "ativo" ? "Militar Ativo" : "Militar Inativo"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 flex-grow">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
                <p className="font-semibold">{militar.nomeCompleto}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome de Guerra</h3>
                <p className="font-semibold">{militar.nomeGuerra}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Posto/Graduação</h3>
                <p className="font-semibold">{militar.posto}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Quadro</h3>
                <p className="font-semibold">{militar.quadro}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
                <p className="font-semibold">{format(new Date(militar.dataNascimento), "dd/MM/yyyy", { locale: ptBR })}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Inclusão</h3>
                <p className="font-semibold">{format(new Date(militar.dataInclusao), "dd/MM/yyyy", { locale: ptBR })}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data da Última Promoção</h3>
                <p className="font-semibold">{format(new Date(militar.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="font-semibold">{militar.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Ficha de Conceito */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Ficha de Conceito do Militar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="cursos-militares" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="cursos-militares">Cursos Militares</TabsTrigger>
              <TabsTrigger value="cursos-civis">Cursos Civis</TabsTrigger>
              <TabsTrigger value="condecoracoes">Condecorações</TabsTrigger>
              <TabsTrigger value="elogios">Elogios</TabsTrigger>
              <TabsTrigger value="punicoes">Punições</TabsTrigger>
            </TabsList>
            
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
                        <td className="p-2 font-bold">{cursosMilitares.reduce((sum, curso) => sum + curso.pontos, 0)}</td>
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
                        <td className="p-2 font-bold">{cursosCivis.reduce((sum, curso) => sum + curso.pontos, 0)}</td>
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
                          <td className="p-2">{format(new Date(cond.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</td>
                          <td className="p-2 font-bold">{cond.pontos}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                        <td className="p-2 font-bold">{condecoracoes.reduce((sum, cond) => sum + cond.pontos, 0)}</td>
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
                          <td className="p-2">{format(new Date(elogio.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</td>
                          <td className="p-2 font-bold">{elogio.pontos}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                        <td className="p-2 font-bold">{elogios.reduce((sum, elogio) => sum + elogio.pontos, 0)}</td>
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
                          <td className="p-2">{format(new Date(punicao.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</td>
                          <td className="p-2 font-bold text-red-500">{punicao.pontos}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan={3} className="p-2 text-right font-bold">Total:</td>
                        <td className="p-2 font-bold text-red-500">{punicoes.reduce((sum, punicao) => sum + punicao.pontos, 0)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center p-4">Não há punições registradas.</div>
              )}
            </TabsContent>
          </Tabs>
          
          <Separator />
          
          <div className="p-4 flex justify-between items-center bg-gray-100">
            <span className="font-bold text-xl">Total de Pontos:</span>
            <span className="font-bold text-xl">{totalPontos.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FichaMilitar;
