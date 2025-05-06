
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DadosPessoais } from "@/components/fichaMilitar/DadosPessoais";
import { FormacaoCardList } from "@/components/fichaMilitar/FormacaoCardList";
import { FichaConceitoOficial } from "@/components/fichaMilitar/FichaConceitoOficial";
import { AcoesNavegacao } from "@/components/fichaMilitar/AcoesNavegacao";
import { ResumoPontos } from "@/components/fichaMilitar/ResumoPontos";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";
import useFichaMilitar from "@/hooks/useFichaMilitar";
import { useEffect } from "react";

const FichaMilitar = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const locationState = location.state as { activeTab?: string } | undefined;
  
  const { 
    militar, 
    cursosMilitares, 
    cursosCivis, 
    condecoracoes, 
    elogios, 
    punicoes, 
    totalPontos, 
    loading,
    activeTab,
    setActiveTab,
    refreshData,
  } = useFichaMilitar(id);
  
  // Utilizar o active tab passado na navegação, se existir
  useEffect(() => {
    if (locationState?.activeTab) {
      setActiveTab(locationState.activeTab);
    }
  }, [locationState, setActiveTab]);
  
  if (loading) {
    return <LoaderComponent message="Carregando dados do militar..." />;
  }
  
  if (!militar) {
    return <div className="flex justify-center items-center h-64">Militar não encontrado.</div>;
  }
  
  // Verificar se o militar é um oficial
  const isOficial = ["Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente"].includes(militar.posto);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ficha Individual do Militar</h1>
        {id && <AcoesNavegacao id={id} />}
      </div>
      
      {/* Dados do Militar */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <DadosPessoais militar={militar} />
      </Card>
      
      {/* Ficha de Conceito */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Ficha de Conceito do Militar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="dados-formacao">Dados de Formação</TabsTrigger>
              {isOficial && <TabsTrigger value="ficha-lei-5461">Ficha Lei 5461</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="dados-formacao" className="p-4 space-y-6">
              <FormacaoCardList 
                militarId={id || ""}
                tipo="cursos_militares"
                items={cursosMilitares}
                onRefresh={refreshData}
              />
              
              <FormacaoCardList 
                militarId={id || ""}
                tipo="cursos_civis"
                items={cursosCivis}
                onRefresh={refreshData}
              />
              
              <FormacaoCardList 
                militarId={id || ""}
                tipo="condecoracoes"
                items={condecoracoes}
                onRefresh={refreshData}
              />
              
              <FormacaoCardList 
                militarId={id || ""}
                tipo="elogios"
                items={elogios}
                onRefresh={refreshData}
              />
              
              <FormacaoCardList 
                militarId={id || ""}
                tipo="punicoes"
                items={punicoes}
                onRefresh={refreshData}
              />
              
              <Separator />
              
              <ResumoPontos totalPontos={totalPontos} />
            </TabsContent>
            
            {isOficial && (
              <TabsContent value="ficha-lei-5461" className="p-0">
                <FichaConceitoOficial
                  militarId={id || ""}
                  cursosMilitares={cursosMilitares}
                  cursosCivis={cursosCivis}
                  condecoracoes={condecoracoes}
                  elogios={elogios}
                  punicoes={punicoes}
                  onDataImported={refreshData}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FichaMilitar;
