
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, PencilLine } from "lucide-react";

interface DadosFormacaoProps {
  militarId: string;
}

const DadosFormacao = ({ militarId }: DadosFormacaoProps) => {
  const [activeTab, setActiveTab] = useState("cursos-militares");
  const [cursosMilitares, setCursosMilitares] = useState<CursoMilitar[]>([]);
  const [cursosCivis, setCursosCivis] = useState<CursoCivil[]>([]);
  const [condecoracoes, setCondecoracoes] = useState<Condecoracao[]>([]);
  const [elogios, setElogios] = useState<Elogio[]>([]);
  const [punicoes, setPunicoes] = useState<Punicao[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  useEffect(() => {
    const fetchDadosFormacao = async () => {
      setLoadingData(true);
      
      try {
        // Fetch cursos militares
        const { data: cursosMilitaresData, error: cursosMilitaresError } = await supabase
          .from("cursos_militares")
          .select("*")
          .eq("militar_id", militarId);
        
        if (cursosMilitaresError) throw cursosMilitaresError;
        setCursosMilitares(cursosMilitaresData || []);
        
        // Fetch cursos civis
        const { data: cursosCivisData, error: cursosCivisError } = await supabase
          .from("cursos_civis")
          .select("*")
          .eq("militar_id", militarId);
        
        if (cursosCivisError) throw cursosCivisError;
        setCursosCivis(cursosCivisData || []);
        
        // Fetch condecorações
        const { data: condecoracoesData, error: condecoracoesError } = await supabase
          .from("condecoracoes")
          .select("*")
          .eq("militar_id", militarId);
        
        if (condecoracoesError) throw condecoracoesError;
        setCondecoracoes(condecoracoesData || []);
        
        // Fetch elogios
        const { data: elogiosData, error: elogiosError } = await supabase
          .from("elogios")
          .select("*")
          .eq("militar_id", militarId);
        
        if (elogiosError) throw elogiosError;
        setElogios(elogiosData || []);
        
        // Fetch punições
        const { data: punicoesData, error: punicoesError } = await supabase
          .from("punicoes")
          .select("*")
          .eq("militar_id", militarId);
        
        if (punicoesError) throw punicoesError;
        setPunicoes(punicoesData || []);
        
      } catch (error) {
        console.error("Erro ao carregar dados de formação:", error);
      } finally {
        setLoadingData(false);
      }
    };
    
    if (militarId) {
      fetchDadosFormacao();
    }
  }, [militarId]);
  
  const handleEditarSecao = (secao: string) => {
    console.log(`Editar seção ${secao}`);
  };
  
  const renderCursosMilitares = () => {
    if (loadingData) return <p>Carregando...</p>;
    
    if (cursosMilitares.length === 0) {
      return <p className="text-gray-500">Nenhum curso militar registrado.</p>;
    }
    
    return (
      <div className="space-y-4">
        {cursosMilitares.map(curso => (
          <div key={curso.id} className="border-b pb-3">
            <h4 className="font-medium">{curso.nome}</h4>
            <p className="text-sm text-gray-600">Instituição: {curso.instituicao}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">Carga horária: {curso.cargaHoraria}h</span>
              <span className="text-sm font-medium">Pontuação: {curso.pontos}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderCursosCivis = () => {
    if (loadingData) return <p>Carregando...</p>;
    
    if (cursosCivis.length === 0) {
      return <p className="text-gray-500">Nenhum curso civil registrado.</p>;
    }
    
    return (
      <div className="space-y-4">
        {cursosCivis.map(curso => (
          <div key={curso.id} className="border-b pb-3">
            <h4 className="font-medium">{curso.nome}</h4>
            <p className="text-sm text-gray-600">Instituição: {curso.instituicao}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">Carga horária: {curso.cargaHoraria}h</span>
              <span className="text-sm font-medium">Pontuação: {curso.pontos}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderCondecoracoes = () => {
    if (loadingData) return <p>Carregando...</p>;
    
    if (condecoracoes.length === 0) {
      return <p className="text-gray-500">Nenhuma condecoração registrada.</p>;
    }
    
    return (
      <div className="space-y-4">
        {condecoracoes.map(condecoracao => (
          <div key={condecoracao.id} className="border-b pb-3">
            <h4 className="font-medium">{condecoracao.tipo}</h4>
            <p className="text-sm text-gray-600">{condecoracao.descricao}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                Recebida em: {new Date(condecoracao.dataRecebimento).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium">Pontuação: {condecoracao.pontos}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderElogios = () => {
    if (loadingData) return <p>Carregando...</p>;
    
    if (elogios.length === 0) {
      return <p className="text-gray-500">Nenhum elogio registrado.</p>;
    }
    
    return (
      <div className="space-y-4">
        {elogios.map(elogio => (
          <div key={elogio.id} className="border-b pb-3">
            <h4 className="font-medium">Elogio {elogio.tipo}</h4>
            <p className="text-sm text-gray-600">{elogio.descricao}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                Recebido em: {new Date(elogio.dataRecebimento).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium">Pontuação: {elogio.pontos}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderPunicoes = () => {
    if (loadingData) return <p>Carregando...</p>;
    
    if (punicoes.length === 0) {
      return <p className="text-gray-500">Nenhuma punição registrada.</p>;
    }
    
    return (
      <div className="space-y-4">
        {punicoes.map(punicao => (
          <div key={punicao.id} className="border-b pb-3">
            <h4 className="font-medium">Punição: {punicao.tipo}</h4>
            <p className="text-sm text-gray-600">{punicao.descricao}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                Recebida em: {new Date(punicao.dataRecebimento).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium">Pontuação: {punicao.pontos}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="bg-gray-100">
        <CardTitle>Ficha de Conceito do Militar</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-5 max-w-full">
            <TabsTrigger value="cursos-militares">Cursos Militares</TabsTrigger>
            <TabsTrigger value="cursos-civis">Cursos Civis</TabsTrigger>
            <TabsTrigger value="condecoracoes">Condecorações</TabsTrigger>
            <TabsTrigger value="elogios">Elogios</TabsTrigger>
            <TabsTrigger value="punicoes">Punições</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cursos-militares">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Cursos Militares</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Adicionar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1"
                  onClick={() => handleEditarSecao('cursos-militares')}>
                  <PencilLine className="h-4 w-4" /> Editar
                </Button>
              </div>
            </div>
            {renderCursosMilitares()}
          </TabsContent>
          
          <TabsContent value="cursos-civis">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Cursos Civis</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Adicionar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1"
                  onClick={() => handleEditarSecao('cursos-civis')}>
                  <PencilLine className="h-4 w-4" /> Editar
                </Button>
              </div>
            </div>
            {renderCursosCivis()}
          </TabsContent>
          
          <TabsContent value="condecoracoes">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Condecorações</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Adicionar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1"
                  onClick={() => handleEditarSecao('condecoracoes')}>
                  <PencilLine className="h-4 w-4" /> Editar
                </Button>
              </div>
            </div>
            {renderCondecoracoes()}
          </TabsContent>
          
          <TabsContent value="elogios">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Elogios</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Adicionar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1"
                  onClick={() => handleEditarSecao('elogios')}>
                  <PencilLine className="h-4 w-4" /> Editar
                </Button>
              </div>
            </div>
            {renderElogios()}
          </TabsContent>
          
          <TabsContent value="punicoes">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Punições</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Adicionar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1"
                  onClick={() => handleEditarSecao('punicoes')}>
                  <PencilLine className="h-4 w-4" /> Editar
                </Button>
              </div>
            </div>
            {renderPunicoes()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DadosFormacao;
