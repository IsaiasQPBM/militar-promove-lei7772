
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { TabelaFichaConceitoOficial } from "./TabelaFichaConceitoOficial";
import { useFichaConceitoPontuacao } from "@/hooks/useFichaConceitoPontuacao";
import { PDFUploader } from "./PDFUploader";

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
  
  const handleDataImported = () => {
    if (onDataImported) onDataImported();
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
            <TabsTrigger value="importar">Importar Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pontuacao" className="p-0 mt-4">
            <TabelaFichaConceitoOficial
              militarId={militarId}
              pontuacao={pontuacao}
              onPontuacaoChange={setPontuacao}
            />
          </TabsContent>
          
          <TabsContent value="importar" className="p-0 mt-4">
            <PDFUploader militarId={militarId} onDataImported={handleDataImported} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
