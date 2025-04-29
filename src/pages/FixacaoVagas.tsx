
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VagaInfo, getVagasInfo } from "@/services/qfvService";
import { toast } from "@/components/ui/use-toast";

const FixacaoVagas = () => {
  const [vagasOficiais, setVagasOficiais] = useState<VagaInfo[]>([]);
  const [vagasPracas, setVagasPracas] = useState<VagaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadVagas = async () => {
      try {
        setIsLoading(true);
        const { vagasOficiais, vagasPracas } = await getVagasInfo();
        setVagasOficiais(vagasOficiais);
        setVagasPracas(vagasPracas);
      } catch (error) {
        console.error("Erro ao carregar informações de vagas:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações do Quadro de Fixação de Vagas.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVagas();
  }, []);
  
  // Cálculos para os totais
  const totalOficiaisPrevistas = vagasOficiais.reduce((acc, curr) => acc + curr.previstas, 0);
  const totalOficiaisExistentes = vagasOficiais.reduce((acc, curr) => acc + curr.existentes, 0);
  const totalPracasPrevistas = vagasPracas.reduce((acc, curr) => acc + curr.previstas, 0);
  const totalPracasExistentes = vagasPracas.reduce((acc, curr) => acc + curr.existentes, 0);

  // Componente para tabela de vagas
  const VagasTable = ({ 
    vagas, 
    isLoading, 
    tipo 
  }: { 
    vagas: VagaInfo[], 
    isLoading: boolean, 
    tipo: "oficiais" | "praças" 
  }) => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <p>Carregando informações de vagas...</p>
        </div>
      );
    }

    const totalPrevistas = vagas.reduce((acc, curr) => acc + curr.previstas, 0);
    const totalExistentes = vagas.reduce((acc, curr) => acc + curr.existentes, 0);
    const totalDisponiveis = totalPrevistas - totalExistentes;
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">{tipo === "oficiais" ? "Posto" : "Graduação"}</th>
              <th className="p-3 text-center">Vagas Previstas</th>
              <th className="p-3 text-center">Vagas Ocupadas</th>
              <th className="p-3 text-center">Vagas Disponíveis</th>
              <th className="p-3 text-center">Situação</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map((vaga, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{vaga.posto}</td>
                <td className="p-3 text-center">{vaga.previstas}</td>
                <td className="p-3 text-center">{vaga.existentes}</td>
                <td className="p-3 text-center">{vaga.disponiveis}</td>
                <td className="p-3 text-center">
                  {vaga.disponiveis > 0 ? (
                    <Badge className="bg-green-600">Disponível</Badge>
                  ) : vaga.disponiveis === 0 ? (
                    <Badge className="bg-orange-500">Completo</Badge>
                  ) : (
                    <Badge className="bg-red-500">Excedente</Badge>
                  )}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="p-3">Total</td>
              <td className="p-3 text-center">{totalPrevistas}</td>
              <td className="p-3 text-center">{totalExistentes}</td>
              <td className="p-3 text-center">{totalDisponiveis}</td>
              <td className="p-3 text-center">
                {totalDisponiveis > 0 ? (
                  <Badge className="bg-green-600">
                    {totalDisponiveis} vagas disponíveis
                  </Badge>
                ) : totalDisponiveis === 0 ? (
                  <Badge className="bg-orange-500">Completo</Badge>
                ) : (
                  <Badge className="bg-red-500">
                    {-totalDisponiveis} excedentes
                  </Badge>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV)</h1>
      
      {/* Vagas de Oficiais */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Vagas de Oficiais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <VagasTable vagas={vagasOficiais} isLoading={isLoading} tipo="oficiais" />
        </CardContent>
      </Card>
      
      {/* Vagas de Praças */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Vagas de Praças</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <VagasTable vagas={vagasPracas} isLoading={isLoading} tipo="praças" />
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
