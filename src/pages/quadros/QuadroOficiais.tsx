
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMilitaresByQuadro } from "@/utils/mockData";
import { Militar } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, FileText, History } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface QuadroOficiaisProps {
  tipo: "QOEM" | "QOE" | "QORR";
}

const QuadroOficiais = ({ tipo }: QuadroOficiaisProps) => {
  const navigate = useNavigate();
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Em uma aplicação real, isso seria uma chamada de API
    const data = getMilitaresByQuadro(tipo);
    setMilitares(data);
  }, [tipo]);

  // Get current militares
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMilitares = militares.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getQuadroTitle = () => {
    switch (tipo) {
      case "QOEM":
        return "Quadro de Oficiais de Estado-Maior";
      case "QOE":
        return "Quadro de Oficiais Especialistas";
      case "QORR":
        return "Quadro de Oficiais da Reserva Remunerada";
      default:
        return "Quadro de Oficiais";
    }
  };

  const handleCadastrarNovo = () => {
    navigate("/cadastro-militar");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{getQuadroTitle()}</h1>
        <Button 
          onClick={handleCadastrarNovo}
          className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
        >
          Novo
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>{getQuadroTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Nº</th>
                  <th className="p-3 text-left">Foto</th>
                  <th className="p-3 text-left">Posto</th>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Nome de Guerra</th>
                  <th className="p-3 text-left">Última Promoção</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentMilitares.length > 0 ? (
                  currentMilitares.map((militar, index) => (
                    <tr key={militar.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{indexOfFirstItem + index + 1}</td>
                      <td className="p-3">
                        <Avatar>
                          <AvatarImage src={militar.foto || ""} />
                          <AvatarFallback>{militar.nomeGuerra.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-semibold">
                          {militar.posto}
                        </Badge>
                      </td>
                      <td className="p-3">{militar.nomeCompleto}</td>
                      <td className="p-3">{militar.nomeGuerra}</td>
                      <td className="p-3">
                        {format(new Date(militar.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
                            onClick={() => navigate(`/militar/${militar.id}/editar`)}
                          >
                            <Pencil className="h-4 w-4 text-white" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                            onClick={() => navigate(`/militar/${militar.id}`)}
                          >
                            <FileText className="h-4 w-4 text-white" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 bg-blue-500 hover:bg-blue-600 border-blue-500"
                            onClick={() => navigate(`/militar/${militar.id}/promocoes`)}
                          >
                            <History className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      Não há militares cadastrados neste quadro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {Math.ceil(militares.length / itemsPerPage) > 1 && (
            <div className="p-4 flex justify-center">
              {Array.from({ length: Math.ceil(militares.length / itemsPerPage) }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  className="mx-1 h-8 w-8"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuadroOficiais;
