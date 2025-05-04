
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao } from "@/types";
import { TabelaFichaConceitoOficial } from "./TabelaFichaConceitoOficial";
import { useFichaConceitoPontuacao } from "@/hooks/useFichaConceitoPontuacao";

interface FichaConceitoOficialProps {
  militarId: string;
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
}

export const FichaConceitoOficial = ({
  militarId,
  cursosMilitares,
  cursosCivis,
  condecoracoes,
  elogios,
  punicoes,
}: FichaConceitoOficialProps) => {
  const { pontuacao, setPontuacao } = useFichaConceitoPontuacao({
    cursosMilitares,
    cursosCivis,
    condecoracoes,
    elogios,
    punicoes
  });

  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle>Ficha de Conceito do Oficial - Lei 5461</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <TabelaFichaConceitoOficial
          militarId={militarId}
          pontuacao={pontuacao}
          onPontuacaoChange={setPontuacao}
        />
      </CardContent>
    </Card>
  );
};
