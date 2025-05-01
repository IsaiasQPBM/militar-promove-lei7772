
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, PencilLine } from "lucide-react";

interface DadosFormacaoProps {
  militarId: string;
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
  onDataChange: () => void;
}

const DadosFormacao = ({ 
  militarId, 
  cursosMilitares,
  cursosCivis,
  condecoracoes,
  elogios,
  punicoes,
  onDataChange 
}: DadosFormacaoProps) => {
  const [activeTab, setActiveTab] = useState("cursos-militares");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEditarSecao = (secao: string) => {
    console.log(`Editar seção ${secao}`);
    // Aqui será implementada a lógica para abrir modal de edição
    // ou navegação para página de edição
  };
  
  const renderCursosMilitares = () => {
    if (isLoading) return <p>Carregando...</p>;
    
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
    if (isLoading) return <p>Carregando...</p>;
    
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
    if (isLoading) return <p>Carregando...</p>;
    
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
    if (isLoading) return <p>Carregando...</p>;
    
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
    if (isLoading) return <p>Carregando...</p>;
    
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
    <>
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
    </>
  );
};

export default DadosFormacao;
