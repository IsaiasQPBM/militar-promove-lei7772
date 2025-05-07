import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { Plus } from "lucide-react";

interface FichaConceitoProps {
  militarId: string;
}

// Schemas and other constant declarations remain the same
// ... keep existing code (schema definitions)

const FichaConceito: React.FC<FichaConceitoProps> = ({ militarId }) => {
  const [cursosMilitares, setCursosMilitares] = useState<CursoMilitar[]>([]);
  const [cursosCivis, setCursosCivis] = useState<CursoCivil[]>([]);
  const [condecoracoes, setCondecoracoes] = useState<Condecoracao[]>([]);
  const [elogios, setElogios] = useState<Elogio[]>([]);
  const [punicoes, setPunicoes] = useState<Punicao[]>([]);
  
  const [openDialogCursoMilitar, setOpenDialogCursoMilitar] = useState(false);
  const [openDialogCursoCivil, setOpenDialogCursoCivil] = useState(false);
  const [openDialogCondecoracao, setOpenDialogCondecoracao] = useState(false);
  const [openDialogElogio, setOpenDialogElogio] = useState(false);
  const [openDialogPunicao, setOpenDialogPunicao] = useState(false);
  
  // Form setup for each dialog
  // ... keep existing code (form setup)
  
  // Funções para adicionar itens (usando mock data em vez de chamadas ao Supabase)
  const adicionarCursoMilitar = async (data: z.infer<typeof cursoMilitarSchema>) => {
    try {
      // Create a new curso militar object with required properties
      const novoCurso: CursoMilitar = {
        id: Date.now().toString(),
        militar_id: militarId,
        nome: data.nome,
        tipo: "Outro", // Default to "Outro" as a valid CursoMilitarTipo
        instituicao: data.instituicao,
        cargahoraria: data.cargahoraria,
        pontos: data.pontos
      };
      
      // Atualizar a lista
      setCursosMilitares([...cursosMilitares, novoCurso]);
      
      toast({
        title: "Curso militar adicionado com sucesso!",
      });
      
      formCursoMilitar.reset();
      setOpenDialogCursoMilitar(false);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar curso militar",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const adicionarCursoCivil = async (data: z.infer<typeof cursoCivilSchema>) => {
    try {
      // Create a new curso civil object with required properties
      const novoCurso: CursoCivil = {
        id: Date.now().toString(),
        militar_id: militarId,
        nome: data.nome,
        tipo: "Superior", // Default to "Superior" as a valid CursoCivilTipo
        instituicao: data.instituicao,
        cargahoraria: data.cargahoraria,
        pontos: data.pontos
      };
      
      // Atualizar a lista
      setCursosCivis([...cursosCivis, novoCurso]);
      
      toast({
        title: "Curso civil adicionado com sucesso!",
      });
      
      formCursoCivil.reset();
      setOpenDialogCursoCivil(false);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar curso civil",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const adicionarCondecoracao = async (data: z.infer<typeof condecoracaoSchema>) => {
    try {
      // Create a new condecoracao object with required properties
      const novaCondecoracao: Condecoracao = {
        id: Date.now().toString(),
        militar_id: militarId,
        tipo: data.tipo,
        descricao: data.descricao,
        datarecebimento: data.datarecebimento,
        pontos: data.pontos
      };
      
      // Atualizar a lista
      setCondecoracoes([...condecoracoes, novaCondecoracao]);
      
      toast({
        title: "Condecoração adicionada com sucesso!",
      });
      
      formCondecoracao.reset();
      setOpenDialogCondecoracao(false);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar condecoração",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const adicionarElogio = async (data: z.infer<typeof elogioSchema>) => {
    try {
      // Create a new elogio object with required properties
      const novoElogio: Elogio = {
        id: Date.now().toString(),
        militar_id: militarId,
        tipo: data.tipo,
        descricao: data.descricao,
        datarecebimento: data.datarecebimento,
        pontos: data.pontos
      };
      
      // Atualizar a lista
      setElogios([...elogios, novoElogio]);
      
      toast({
        title: "Elogio adicionado com sucesso!",
      });
      
      formElogio.reset();
      setOpenDialogElogio(false);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar elogio",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const adicionarPunicao = async (data: z.infer<typeof punicaoSchema>) => {
    try {
      // Create a new punicao object with required properties
      const novaPunicao: Punicao = {
        id: Date.now().toString(),
        militar_id: militarId,
        tipo: data.tipo,
        descricao: data.descricao,
        datarecebimento: data.datarecebimento,
        pontos: data.pontos
      };
      
      // Atualizar a lista
      setPunicoes([...punicoes, novaPunicao]);
      
      toast({
        title: "Punição adicionada com sucesso!",
      });
      
      formPunicao.reset();
      setOpenDialogPunicao(false);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar punição",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Cursos Militares */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white flex flex-row items-center justify-between">
          <CardTitle>Cursos Militares</CardTitle>
          <Dialog open={openDialogCursoMilitar} onOpenChange={setOpenDialogCursoMilitar}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white text-cbmepi-purple hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Curso Militar</DialogTitle>
              </DialogHeader>
              <Form {...formCursoMilitar}>
                <form onSubmit={formCursoMilitar.handleSubmit(adicionarCursoMilitar)} className="space-y-4">
                  <FormField
                    control={formCursoMilitar.control}
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
                    control={formCursoMilitar.control}
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
                      control={formCursoMilitar.control}
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
                      control={formCursoMilitar.control}
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
                  
                  <div>
                    <FormLabel>Anexo (opcional)</FormLabel>
                    <Input type="file" className="mt-1" />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {cursosMilitares.length === 0 ? (
            <p className="text-center text-gray-500 my-4">Nenhum curso militar registrado</p>
          ) : (
            <div className="space-y-2">
              {cursosMilitares.map(curso => (
                <div key={curso.id} className="p-3 border rounded-lg">
                  <div className="font-medium">{curso.nome}</div>
                  <div className="text-sm text-gray-600">{curso.instituicao}</div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>Carga Horária: {curso.cargahoraria}h</span>
                    <span>Pontos: {curso.pontos}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Cursos Civis */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white flex flex-row items-center justify-between">
          <CardTitle>Cursos Civis</CardTitle>
          <Dialog open={openDialogCursoCivil} onOpenChange={setOpenDialogCursoCivil}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white text-cbmepi-purple hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Curso Civil</DialogTitle>
              </DialogHeader>
              <Form {...formCursoCivil}>
                <form onSubmit={formCursoCivil.handleSubmit(adicionarCursoCivil)} className="space-y-4">
                  <FormField
                    control={formCursoCivil.control}
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
                    control={formCursoCivil.control}
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
                      control={formCursoCivil.control}
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
                      control={formCursoCivil.control}
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
                  
                  <div>
                    <FormLabel>Anexo (opcional)</FormLabel>
                    <Input type="file" className="mt-1" />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {cursosCivis.length === 0 ? (
            <p className="text-center text-gray-500 my-4">Nenhum curso civil registrado</p>
          ) : (
            <div className="space-y-2">
              {cursosCivis.map(curso => (
                <div key={curso.id} className="p-3 border rounded-lg">
                  <div className="font-medium">{curso.nome}</div>
                  <div className="text-sm text-gray-600">{curso.instituicao}</div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>Carga Horária: {curso.cargahoraria}h</span>
                    <span>Pontos: {curso.pontos}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Condecorações e Elogios */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white flex flex-row items-center justify-between">
          <CardTitle>Condecorações e Elogios</CardTitle>
          <div className="space-x-2">
            <Dialog open={openDialogCondecoracao} onOpenChange={setOpenDialogCondecoracao}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white text-cbmepi-purple hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-1" /> Condecoração
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Condecoração</DialogTitle>
                </DialogHeader>
                <Form {...formCondecoracao}>
                  <form onSubmit={formCondecoracao.handleSubmit(adicionarCondecoracao)} className="space-y-4">
                    <FormField
                      control={formCondecoracao.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Condecoração</FormLabel>
                          <FormControl>
                            <Input placeholder="Tipo de condecoração" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formCondecoracao.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descrição da condecoração" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={formCondecoracao.control}
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
                        control={formCondecoracao.control}
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
                    
                    <div>
                      <FormLabel>Anexo (opcional)</FormLabel>
                      <Input type="file" className="mt-1" />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple">
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={openDialogElogio} onOpenChange={setOpenDialogElogio}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white text-cbmepi-purple hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-1" /> Elogio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Elogio</DialogTitle>
                </DialogHeader>
                <Form {...formElogio}>
                  <form onSubmit={formElogio.handleSubmit(adicionarElogio)} className="space-y-4">
                    <FormField
                      control={formElogio.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Elogio</FormLabel>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formElogio.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descrição do elogio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={formElogio.control}
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
                        control={formElogio.control}
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
                    
                    <div>
                      <FormLabel>Anexo (opcional)</FormLabel>
                      <Input type="file" className="mt-1" />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple">
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {condecoracoes.length === 0 && elogios.length === 0 ? (
            <p className="text-center text-gray-500 my-4">Nenhuma condecoração ou elogio registrado</p>
          ) : (
            <div className="space-y-4">
              {condecoracoes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Condecorações</h3>
                  <div className="space-y-2">
                    {condecoracoes.map(cond => (
                      <div key={cond.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{cond.tipo}</div>
                        <div className="text-sm">{cond.descricao}</div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span>Data: {cond.datarecebimento}</span>
                          <span>Pontos: {cond.pontos}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {elogios.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Elogios</h3>
                  <div className="space-y-2">
                    {elogios.map(elogio => (
                      <div key={elogio.id} className="p-3 border rounded-lg">
                        <div className="font-medium">Elogio {elogio.tipo}</div>
                        <div className="text-sm">{elogio.descricao}</div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span>Data: {elogio.datarecebimento}</span>
                          <span>Pontos: {elogio.pontos}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Punições */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white flex flex-row items-center justify-between">
          <CardTitle>Punições</CardTitle>
          <Dialog open={openDialogPunicao} onOpenChange={setOpenDialogPunicao}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white text-cbmepi-purple hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Punição</DialogTitle>
              </DialogHeader>
              <Form {...formPunicao}>
                <form onSubmit={formPunicao.handleSubmit(adicionarPunicao)} className="space-y-4">
                  <FormField
                    control={formPunicao.control}
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
                    control={formPunicao.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descrição da punição" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formPunicao.control}
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
                      control={formPunicao.control}
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
                  
                  <div>
                    <FormLabel>Anexo (opcional)</FormLabel>
                    <Input type="file" className="mt-1" />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {punicoes.length === 0 ? (
            <p className="text-center text-gray-500 my-4">Nenhuma punição registrada</p>
          ) : (
            <div className="space-y-2">
              {punicoes.map(punicao => (
                <div key={punicao.id} className="p-3 border rounded-lg">
                  <div className="font-medium">Punição: {punicao.tipo}</div>
                  <div className="text-sm">{punicao.descricao}</div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>Data: {punicao.datarecebimento}</span>
                    <span>Pontos: {punicao.pontos}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FichaConceito;
