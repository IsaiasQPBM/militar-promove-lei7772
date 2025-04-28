
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CriteriosMerecimento = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critérios de Merecimento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Conforme a Lei 7.772/2022, a pontuação para o Quadro de Acesso por Merecimento é calculada com base nos seguintes critérios:
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Pontos Positivos:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cursos Militares: até 10 pontos, conforme a categoria do curso;</li>
              <li>Cursos Civis: até 4 pontos, dependendo do nível (superior, especialização, mestrado, doutorado);</li>
              <li>Medalhas e Condecorações: até 1 ponto, variando conforme a autoridade concedente;</li>
              <li>Elogios: até 0,25 ponto, dependendo se individual ou coletivo.</li>
            </ul>
            
            <h3 className="font-semibold">Pontos Negativos:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Punições: até 5 pontos negativos, conforme a gravidade (repreensão, detenção ou prisão);</li>
              <li>Falta de aproveitamento em cursos militares: até 5 pontos negativos.</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            No caso de empate na pontuação final, prevalece o critério de antiguidade para o desempate.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
