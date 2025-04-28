
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CriteriosAntiguidade = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critérios de Antiguidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            De acordo com a Lei 7.772/2022, o ordenamento hierárquico dos oficiais e praças é determinado pelos seguintes critérios de antiguidade:
          </p>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>Data de ingresso no respectivo quadro (mais antiga confere maior antiguidade);</li>
            <li>Data da última promoção (mais antiga confere maior antiguidade);</li>
            <li>Data de nascimento (maior idade confere maior antiguidade);</li>
            <li>Classificação em curso de formação ou habilitação (melhor classificação confere maior antiguidade).</li>
          </ol>
          
          <p className="text-sm text-muted-foreground mt-4">
            A posição no Quadro de Acesso por Antiguidade (QAA) é um dos critérios para promoção conforme estabelecido na legislação vigente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
