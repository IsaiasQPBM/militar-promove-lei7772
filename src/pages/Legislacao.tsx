
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Legislacao = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Legislação</h1>
      
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Lei nº 7.772, de 04 de abril de 2022</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Lei de Promoção de Oficiais e Praças do CBMEPI</h2>
              <p className="text-gray-600 mt-1">
                Dispõe sobre as promoções de Oficiais e Praças da Polícia Militar e do Corpo de Bombeiros Militar do Estado do Piauí, alterando a Lei nº 5.949, de 17 de dezembro de 2009.
              </p>
            </div>
            <Button className="bg-cbmepi-red hover:bg-red-700">
              <Download className="h-4 w-4 mr-2" /> Baixar PDF
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Capítulo I - Disposições Preliminares</h3>
              <p className="text-sm text-gray-700">
                Art. 1º Esta lei estabelece os critérios e requisitos para as promoções de Oficiais e Praças da Polícia Militar e do Corpo de Bombeiros Militar do Estado do Piauí.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Art. 2º As promoções nas corporações militares são formas de valorização profissional, baseando-se nos princípios da hierarquia e disciplina, fundamentais para a carreira militar.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Capítulo II - Dos Quadros de Acesso</h3>
              <p className="text-sm text-gray-700">
                Art. 3º Os Quadros de Acesso são relações de Oficiais e Praças organizados por antiguidade (QAA) e merecimento (QAM), constituindo a base para as promoções nas respectivas modalidades.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Art. 4º A antiguidade do Oficial ou Praça é contada a partir da data de promoção ao posto ou graduação, prevalecendo em caso de igualdade, sucessivamente, a data de promoção ao posto anterior, a data de praça e a idade.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Art. 5º O merecimento é constituído por valores profissionais e pessoais que distinguem o Oficial ou Praça entre seus pares, conferindo-lhe maior capacidade para o desempenho de cargos superiores.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Capítulo III - Dos Critérios de Promoção</h3>
              <p className="text-sm text-gray-700">
                Art. 6º As promoções nos quadros da Polícia Militar e do Corpo de Bombeiros Militar serão realizadas pelos seguintes critérios:
              </p>
              <ol className="list-decimal pl-5 space-y-1 mt-2 text-sm text-gray-700">
                <li>Antiguidade;</li>
                <li>Merecimento;</li>
                <li>Por ato de bravura;</li>
                <li>Post-mortem;</li>
                <li>Em ressarcimento de preterição.</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Capítulo IV - Da Ficha de Conceito</h3>
              <p className="text-sm text-gray-700">
                Art. 12º A ficha de conceito é o documento que reúne as informações sobre o desempenho do militar, incluindo cursos, elogios, condecorações, tempo de serviço e outras informações relevantes para avaliação.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Art. 13º A pontuação será atribuída conforme previsto no anexo único desta lei, considerando os aspectos positivos e negativos da carreira do militar.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Capítulo V - Das Comissões de Promoção</h3>
              <p className="text-sm text-gray-700">
                Art. 14º As Comissões de Promoção de Oficiais (CPO) e de Praças (CPP) são órgãos responsáveis por organizar os processos de promoção, elaborar os Quadros de Acesso e emitir parecer sobre recursos e requerimentos relacionados às promoções.
              </p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Documentos Relacionados</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-cbmepi-purple" />
                  <span>Anexo Único - Ficha de Conceito do Oficial</span>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-cbmepi-purple" />
                  <span>Decreto de Regulamentação nº 21.423/2022</span>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Legislacao;
