import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Militar, MilitarComPontuacao } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MilitarList } from "@/components/antiguidade/MilitarList";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";

const AntiguidadePage: React.FC = () => {
  const [tipo, setTipo] = useState<"oficiais" | "pracas">("oficiais");
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMilitares = async () => {
      setLoading(true);
      try {
        const quadro = tipo === "oficiais" ? "QOEM" : "QPBM";
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("quadro", quadro)
          .eq("situacao", "ativo")
          .order("data_ingresso", { ascending: true });

        if (error) throw error;

        // Transform the data to match our Militar interface
        const transformedData: Militar[] = data.map(item => ({
          id: item.id,
          nome: item.nome,
          nomeCompleto: item.nome,
          nomeGuerra: item.nomeguerra || item.nome,
          posto: toPostoPatente(item.posto),
          quadro: toQuadroMilitar(item.quadro),
          dataNascimento: item.datanascimento || "",
          dataInclusao: item.data_ingresso || "",
          dataUltimaPromocao: item.dataultimapromocao || "",
          situacao: toSituacaoMilitar(item.situacao),
          tipoSanguineo: toTipoSanguineo(item.tipo_sanguineo),
          sexo: toSexo(item.sexo),
          email: item.email,
          foto: item.foto,
          unidade: item.unidade
        }));

        setMilitares(transformedData);
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMilitares();
  }, [tipo]);

  const mapearMilitaresParaMilitaresComPontos = (militares: Militar[]): MilitarComPontuacao[] => {
    return militares.map(militar => ({
      ...militar,
      pontuacao: 0 // Adiciona a pontuação como 0 por padrão para militares da antiguidade
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quadro de Acesso por Antiguidade</h1>
      
      <div className="mb-6">
        <Label>Tipo de Quadro</Label>
        <RadioGroup value={tipo} onValueChange={setTipo} className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oficiais" id="oficiais" />
            <Label htmlFor="oficiais">Oficiais</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pracas" id="pracas" />
            <Label htmlFor="pracas">Praças</Label>
          </div>
        </RadioGroup>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-cbmepi-purple" />
        </div>
      ) : (
        <MilitarList 
          militares={mapearMilitaresParaMilitaresComPontos(militares)}
          onQuadroChange={(quadro) => console.log("Quadro selecionado:", quadro)}
          quadroAtual={tipo === "oficiais" ? "QOEM" : "QPBM"}
          onShowDetails={(id, posto, quadro) => {
            navigate(`/militar/${id}`);
          }}
        />
      )}
    </div>
  );
};

export default AntiguidadePage;
