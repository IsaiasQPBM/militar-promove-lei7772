
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { TabelaFichaConceitoOficial } from "./TabelaFichaConceitoOficial";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import useFichaConceitoPontuacao from "@/hooks/useFichaConceitoPontuacao";
import { salvarFichaConceito } from "@/services/fichaService";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface FichaConceitoOficialProps {
  militarId: string;
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
  onDataImported?: () => void;
}

export const FichaConceitoOficial = ({
  militarId,
  cursosMilitares,
  cursosCivis,
  condecoracoes,
  elogios,
  punicoes,
  onDataImported,
}: FichaConceitoOficialProps) => {
  const { pontuacao, setPontuacao } = useFichaConceitoPontuacao({
    cursosMilitares,
    cursosCivis,
    condecoracoes,
    elogios,
    punicoes
  });

  const [activeTab, setActiveTab] = useState("pontuacao");
  const [salvando, setSalvando] = useState(false);
  const [totalPontos, setTotalPontos] = useState(0);
  const navigate = useNavigate();

  // Calcular total de pontos sempre que a pontuação mudar
  useEffect(() => {
    if (pontuacao) {
      const total = pontuacao.somaTotal;
      setTotalPontos(total);
      
      // Auto-save pontuação when data changes
      handleSavePontuacaoAutomaticamente();
    }
  }, [pontuacao]);
  
  // Função para salvar automaticamente a pontuação quando mudanças ocorrerem
  const handleSavePontuacaoAutomaticamente = async () => {
    if (!pontuacao) return;
    
    try {
      // Salvar tempo de serviço e total de pontos
      const tempoServicoQuadro = pontuacao.tempoServicoQuadro.pontosPositivos;
      
      await salvarFichaConceito({
        militarId,
        tempoServicoQuadro,
        totalPontos: pontuacao.somaTotal
      });
      
      // Atualizar dados se callback fornecido
      if (onDataImported) {
        onDataImported();
      }
    } catch (error) {
      console.error("Erro ao salvar pontuação automática:", error);
    }
  };
  
  const handleSalvarPontuacao = async () => {
    if (!pontuacao) return;
    
    try {
      setSalvando(true);
      
      // Salvar tempo de serviço e total de pontos
      const tempoServicoQuadro = pontuacao.tempoServicoQuadro.pontosPositivos;
      
      await salvarFichaConceito({
        militarId,
        tempoServicoQuadro,
        totalPontos: pontuacao.somaTotal
      });
      
      toast({
        title: "Pontuação salva",
        description: "Os dados da ficha de conceito foram salvos com sucesso."
      });
      
      // Atualizar dados se callback fornecido
      if (onDataImported) {
        onDataImported();
      }
    } catch (error) {
      console.error("Erro ao salvar pontuação:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da ficha de conceito.",
        variant: "destructive"
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleEditarDadosFormacao = () => {
    // Navegar para a aba de dados de formação
    navigate(`/ficha-militar/${militarId}`, { state: { activeTab: 'dados-formacao' } });
  };

  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle>Ficha de Conceito do Oficial - Lei 5461</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
            <TabsTrigger value="acoes">Ações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pontuacao" className="p-0 mt-4">
            {pontuacao && (
              <TabelaFichaConceitoOficial
                militarId={militarId}
                pontuacao={pontuacao}
                onPontuacaoChange={setPontuacao}
              />
            )}
          </TabsContent>
          
          <TabsContent value="acoes" className="mt-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-start gap-2"
                onClick={handleEditarDadosFormacao}
              >
                <Edit className="h-4 w-4" />
                Editar Dados de Formação
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-start gap-2"
                onClick={() => navigate('/ficha-conceito/' + militarId)}
              >
                <Plus className="h-4 w-4" />
                Adicionar Novos Dados
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t flex justify-between items-center">
        <div>
          <span className="font-bold">Total de Pontos:</span>
          <span className="font-bold text-xl ml-2">{totalPontos.toFixed(2)}</span>
        </div>
        <Button 
          onClick={handleSalvarPontuacao} 
          disabled={salvando}
          className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
        >
          {salvando ? "Salvando..." : "Salvar Pontuação"}
        </Button>
      </CardFooter>
    </Card>
  );
};
