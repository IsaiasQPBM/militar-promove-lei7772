
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CriterioProps = {
  numero: number;
  descricao: string;
};

const Criterio = ({ numero, descricao }: CriterioProps) => {
  return (
    <li className="py-1">{descricao}</li>
  );
};

export const CriteriosAntiguidade = () => {
  const criterios = [
    { numero: 1, descricao: "Data de ingresso no respectivo quadro (mais antiga confere maior antiguidade);" },
    { numero: 2, descricao: "Data da última promoção (mais antiga confere maior antiguidade);" },
    { numero: 3, descricao: "Data de nascimento (maior idade confere maior antiguidade);" },
    { numero: 4, descricao: "Classificação em curso de formação ou habilitação (melhor classificação confere maior antiguidade)." }
  ];

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
            {criterios.map((criterio) => (
              <Criterio key={criterio.numero} {...criterio} />
            ))}
          </ol>
          
          <p className="text-sm text-muted-foreground mt-4">
            A posição no Quadro de Acesso por Antiguidade (QAA) é um dos critérios para promoção conforme estabelecido na legislação vigente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
