
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FichaConceito from "@/components/FichaConceito";
import LoaderComponent from "@/components/editarMilitar/LoaderComponent";

const FichaConceitoPage = () => {
  const { id: militarId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [militarNome, setMilitarNome] = useState("");
  const [militarPosto, setMilitarPosto] = useState("");

  useEffect(() => {
    const fetchMilitarInfo = async () => {
      if (!militarId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("militares")
          .select("nome, posto, nomeguerra")
          .eq("id", militarId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setMilitarNome(data.nomeguerra || data.nome);
          setMilitarPosto(data.posto);
        }
      } catch (error) {
        console.error("Erro ao buscar informações do militar:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do militar.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitarInfo();
  }, [militarId]);

  if (loading) {
    return <LoaderComponent message="Carregando dados..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate(`/ficha-militar/${militarId}`)}
        >
          <ArrowLeft className="h-4 w-4" /> Voltar à Ficha
        </Button>
      </div>
      
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Adicionar Dados na Ficha de Conceito - {militarPosto} {militarNome}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {militarId && <FichaConceito militarId={militarId} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default FichaConceitoPage;
