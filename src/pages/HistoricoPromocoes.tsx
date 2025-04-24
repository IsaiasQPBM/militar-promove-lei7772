
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMilitarById, getPromocoesByMilitar } from "@/utils/mockData";
import { Militar, Promocao } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";

const HistoricoPromocoes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [militar, setMilitar] = useState<Militar | null>(null);
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  
  useEffect(() => {
    if (id) {
      // Obter dados do militar
      const militarData = getMilitarById(id);
      if (militarData) {
        setMilitar(militarData);
      }
      
      // Obter promoções
      const promocoesData = getPromocoesByMilitar(id);
      setPromocoes(promocoesData);
    }
  }, [id]);
  
  if (!militar) {
    return <div className="flex justify-center items-center h-64">Carregando dados do militar...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Histórico de Promoções</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(`/militar/${id}`)}
            variant="outline"
          >
            Ver Ficha Completa
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </div>
      
      {/* Dados do Militar */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Dados do Militar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={militar.foto || ""} />
              <AvatarFallback>{militar.nomeGuerra.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{militar.nomeCompleto}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="outline">{militar.posto}</Badge>
                <Badge variant="outline">{militar.quadro}</Badge>
                <Badge className={militar.situacao === "ativo" ? "bg-green-600" : "bg-orange-500"}>
                  {militar.situacao === "ativo" ? "Militar Ativo" : "Militar Inativo"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Histórico de Promoções */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Histórico de Promoções</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {promocoes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Posto/Patente</th>
                    <th className="p-3 text-left">Data da Promoção</th>
                    <th className="p-3 text-left">Critério de Promoção</th>
                    <th className="p-3 text-left">Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {promocoes.map((promocao) => (
                    <tr key={promocao.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Badge variant="outline" className="font-semibold">
                          {promocao.cargo}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {format(new Date(promocao.dataPromocao), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-3">{promocao.criterio}</td>
                      <td className="p-3">
                        {promocao.anexoDocumento ? (
                          <Button variant="outline" size="sm">
                            <FileIcon className="h-4 w-4 mr-2" /> Ver Documento
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">Não disponível</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8">
              <p>Não há registros de promoções para este militar.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoPromocoes;
