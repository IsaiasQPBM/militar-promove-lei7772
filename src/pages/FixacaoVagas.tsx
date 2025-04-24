
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FixacaoVagas = () => {
  // Dados de exemplo para vagas de oficiais
  const vagasOficiais = [
    { posto: "Coronel", previstas: 8, existentes: 6 },
    { posto: "Tenente-Coronel", previstas: 12, existentes: 10 },
    { posto: "Major", previstas: 20, existentes: 16 },
    { posto: "Capitão", previstas: 35, existentes: 28 },
    { posto: "1º Tenente", previstas: 45, existentes: 38 },
    { posto: "2º Tenente", previstas: 50, existentes: 42 }
  ];
  
  // Dados de exemplo para vagas de praças
  const vagasPracas = [
    { posto: "Subtenente", previstas: 25, existentes: 20 },
    { posto: "1º Sargento", previstas: 40, existentes: 32 },
    { posto: "2º Sargento", previstas: 65, existentes: 55 },
    { posto: "3º Sargento", previstas: 90, existentes: 72 },
    { posto: "Cabo", previstas: 130, existentes: 105 },
    { posto: "Soldado", previstas: 350, existentes: 290 }
  ];
  
  // Cálculos para os totais
  const totalOficiaisPrevistas = vagasOficiais.reduce((acc, curr) => acc + curr.previstas, 0);
  const totalOficiaisExistentes = vagasOficiais.reduce((acc, curr) => acc + curr.existentes, 0);
  const totalPracasPrevistas = vagasPracas.reduce((acc, curr) => acc + curr.previstas, 0);
  const totalPracasExistentes = vagasPracas.reduce((acc, curr) => acc + curr.existentes, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV)</h1>
      
      {/* Vagas de Oficiais */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Vagas de Oficiais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Posto</th>
                  <th className="p-3 text-center">Vagas Previstas</th>
                  <th className="p-3 text-center">Vagas Existentes</th>
                  <th className="p-3 text-center">Situação</th>
                </tr>
              </thead>
              <tbody>
                {vagasOficiais.map((vaga, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{vaga.posto}</td>
                    <td className="p-3 text-center">{vaga.previstas}</td>
                    <td className="p-3 text-center">{vaga.existentes}</td>
                    <td className="p-3 text-center">
                      {vaga.existentes < vaga.previstas ? (
                        <Badge className="bg-green-600">Disponível</Badge>
                      ) : vaga.existentes === vaga.previstas ? (
                        <Badge className="bg-orange-500">Completo</Badge>
                      ) : (
                        <Badge className="bg-red-500">Excedente</Badge>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-center">{totalOficiaisPrevistas}</td>
                  <td className="p-3 text-center">{totalOficiaisExistentes}</td>
                  <td className="p-3 text-center">
                    {totalOficiaisExistentes < totalOficiaisPrevistas ? (
                      <Badge className="bg-green-600">
                        {totalOficiaisPrevistas - totalOficiaisExistentes} vagas disponíveis
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500">Completo</Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Vagas de Praças */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Vagas de Praças</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Graduação</th>
                  <th className="p-3 text-center">Vagas Previstas</th>
                  <th className="p-3 text-center">Vagas Existentes</th>
                  <th className="p-3 text-center">Situação</th>
                </tr>
              </thead>
              <tbody>
                {vagasPracas.map((vaga, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{vaga.posto}</td>
                    <td className="p-3 text-center">{vaga.previstas}</td>
                    <td className="p-3 text-center">{vaga.existentes}</td>
                    <td className="p-3 text-center">
                      {vaga.existentes < vaga.previstas ? (
                        <Badge className="bg-green-600">Disponível</Badge>
                      ) : vaga.existentes === vaga.previstas ? (
                        <Badge className="bg-orange-500">Completo</Badge>
                      ) : (
                        <Badge className="bg-red-500">Excedente</Badge>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-center">{totalPracasPrevistas}</td>
                  <td className="p-3 text-center">{totalPracasExistentes}</td>
                  <td className="p-3 text-center">
                    {totalPracasExistentes < totalPracasPrevistas ? (
                      <Badge className="bg-green-600">
                        {totalPracasPrevistas - totalPracasExistentes} vagas disponíveis
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500">Completo</Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Observações</h3>
        <p className="text-sm text-gray-700">
          O Quadro de Fixação de Vagas (QFV) é atualizado conforme as diretrizes da Lei 7.772/2022, que estabelece os critérios para o preenchimento de vagas
          e realização de promoções no Corpo de Bombeiros Militar do Estado do Piauí. A cada nova inclusão ou promoção, o quadro é automaticamente
          atualizado para refletir a situação atual do efetivo.
        </p>
      </div>
    </div>
  );
};

export default FixacaoVagas;
