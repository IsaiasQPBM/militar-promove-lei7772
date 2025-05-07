
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MerecimentoList } from "@/components/merecimento/MerecimentoList";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MilitarComPontuacao } from "@/types";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";
import { FileText, Download } from "lucide-react";

const Merecimento = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<"oficiais" | "pracas">("oficiais");
  const [militares, setMilitares] = useState<MilitarComPontuacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar militares com pontuação
  const buscarMilitaresComPontuacao = async (quadro: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("militares")
        .select(`
          *,
          fichas_conceito(totalpontos)
        `)
        .eq("quadro", quadro)
        .eq("situacao", "ativo");

      if (error) throw error;

      const militaresComPontuacao: MilitarComPontuacao[] = data.map((militar) => ({
        id: militar.id,
        nome: militar.nome,
        nomeCompleto: militar.nome,
        nomeGuerra: militar.nomeguerra || militar.nome,
        posto: toPostoPatente(militar.posto),
        quadro: toQuadroMilitar(militar.quadro),
        dataNascimento: militar.datanascimento || "",
        dataInclusao: militar.data_ingresso || "",
        dataUltimaPromocao: militar.dataultimapromocao || "",
        situacao: toSituacaoMilitar(militar.situacao),
        email: militar.email || "",
        foto: militar.foto || "",
        tipoSanguineo: toTipoSanguineo(militar.tipo_sanguineo),
        sexo: toSexo(militar.sexo),
        unidade: militar.unidade || "",
        pontuacao: militar.fichas_conceito?.[0]?.totalpontos || 0
      }));

      setMilitares(militaresComPontuacao);
    } catch (error) {
      console.error("Erro ao buscar militares com pontuação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de militares.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Type-safe handler for RadioGroup
  const handleTipoChange = (value: "oficiais" | "pracas") => {
    setTipo(value);
  };

  // Efeito para carregar militares quando o tipo mudar
  useEffect(() => {
    const quadro = tipo === "oficiais" ? "QOEM" : "QPBM";
    buscarMilitaresComPontuacao(quadro);
  }, [tipo]);

  // Função para exportar a lista
  const exportarLista = (formato: string) => {
    toast({
      title: "Exportando lista",
      description: `A lista será exportada em formato ${formato}.`
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quadro de Acesso por Merecimento</h1>
      
      <div className="mb-6">
        <Label>Tipo de Quadro</Label>
        <RadioGroup value={tipo} onValueChange={handleTipoChange} className="flex space-x-4 mt-2">
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
      
      <MerecimentoList
        militares={militares}
        onQuadroChange={(quadro) => {
          console.log("Quadro selecionado:", quadro);
          if (quadro) {
            buscarMilitaresComPontuacao(quadro);
          }
        }}
        quadroAtual={tipo === "oficiais" ? "QOEM" : "QPBM"}
        onShowDetails={(id, posto, quadro) => {
          navigate(`/militar/${id}`);
        }}
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações sobre o Quadro de Acesso por Merecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="criterios">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="criterios">Critérios</TabsTrigger>
                <TabsTrigger value="legislacao">Legislação</TabsTrigger>
                <TabsTrigger value="calendario">Calendário</TabsTrigger>
              </TabsList>
              <TabsContent value="criterios" className="space-y-4 pt-4">
                <h3 className="font-semibold">Critérios para Pontuação</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tempo de serviço no quadro: 0,1 ponto por mês</li>
                  <li>Cursos militares: até 4,0 pontos por curso</li>
                  <li>Cursos civis: até 3,0 pontos por curso</li>
                  <li>Condecorações: até 1,0 ponto por condecoração</li>
                  <li>Elogios: até 0,2 ponto por elogio</li>
                </ul>
              </TabsContent>
              <TabsContent value="legislacao" className="space-y-4 pt-4">
                <h3 className="font-semibold">Legislação Aplicável</h3>
                <p>Lei 5.461 de 07/06/1991 - Dispõe sobre o Quadro de Acesso por Merecimento</p>
                <p>Lei 7.772 de 04/04/2022 - Dispõe sobre as promoções de Oficiais e Praças</p>
              </TabsContent>
              <TabsContent value="calendario" className="space-y-4 pt-4">
                <h3 className="font-semibold">Calendário de Promoções</h3>
                <p>Inclusão no Quadro de Acesso: 18 de julho e 23 de dezembro</p>
                <p>Promoções: 25 de agosto e 25 de dezembro</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => exportarLista("PDF")}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
        <Button variant="outline" onClick={() => exportarLista("CSV")}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>
    </div>
  );
};

export default Merecimento;
