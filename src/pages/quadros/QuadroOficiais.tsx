
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Militar } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, FileText, History } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getMilitaresByQuadro } from "@/services/militarService";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuadroOficiaisProps {
  tipo: "QOEM" | "QOE" | "QORR";
}

const QuadroOficiais = ({ tipo }: QuadroOficiaisProps) => {
  const navigate = useNavigate();
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 5 : 10;

  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        const data = await getMilitaresByQuadro(tipo);
        setMilitares(data);
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitares();
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
        return isMobile ? "Oficiais de Estado-Maior" : "Quadro de Oficiais de Estado-Maior";
      case "QOE":
        return isMobile ? "Oficiais Especialistas" : "Quadro de Oficiais Especialistas";
      case "QORR":
        return isMobile ? "Oficiais da Reserva" : "Quadro de Oficiais da Reserva Remunerada";
      default:
        return "Quadro de Oficiais";
    }
  };

  const handleCadastrarNovo = () => {
    navigate("/cadastro-militar");
  };

  return (
    <div className="space-y-2 md:space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold">{getQuadroTitle()}</h1>
        <Button 
          onClick={handleCadastrarNovo}
          size={isMobile ? "sm" : "default"}
          className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
        >
          Novo
        </Button>
      </div>

      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-cbmepi-purple text-white py-2 md:py-4">
          <CardTitle className="text-base md:text-lg">{getQuadroTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-4 md:p-8">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-cbmepi-purple"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 md:p-3 text-left">Nº</th>
                    <th className="p-2 md:p-3 text-left">Foto</th>
                    <th className="p-2 md:p-3 text-left">Posto</th>
                    {!isMobile && <th className="p-2 md:p-3 text-left">Nome</th>}
                    <th className="p-2 md:p-3 text-left">Nome de Guerra</th>
                    {!isMobile && <th className="p-2 md:p-3 text-left">Última Promoção</th>}
                    <th className="p-2 md:p-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMilitares.length > 0 ? (
                    currentMilitares.map((militar, index) => (
                      <tr key={militar.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 md:p-3 font-medium">{indexOfFirstItem + index + 1}</td>
                        <td className="p-2 md:p-3">
                          <Avatar className="h-6 w-6 md:h-8 md:w-8">
                            <AvatarImage src={militar.foto || ""} />
                            <AvatarFallback>{militar.nomeGuerra.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </td>
                        <td className="p-2 md:p-3">
                          <Badge variant="outline" className="font-semibold text-[10px] md:text-xs">
                            {militar.posto}
                          </Badge>
                        </td>
                        {!isMobile && <td className="p-2 md:p-3">{militar.nomeCompleto}</td>}
                        <td className="p-2 md:p-3">{militar.nomeGuerra}</td>
                        {!isMobile && (
                          <td className="p-2 md:p-3">
                            {format(new Date(militar.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}
                          </td>
                        )}
                        <td className="p-2 md:p-3">
                          <div className="flex space-x-1 md:space-x-2">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-6 w-6 md:h-8 md:w-8 bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
                              onClick={() => navigate(`/militar/${militar.id}/editar`)}
                            >
                              <Pencil className="h-3 w-3 md:h-4 md:w-4 text-white" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-6 w-6 md:h-8 md:w-8 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                              onClick={() => navigate(`/militar/${militar.id}`)}
                            >
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-white" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-6 w-6 md:h-8 md:w-8 bg-blue-500 hover:bg-blue-600 border-blue-500"
                              onClick={() => navigate(`/militar/${militar.id}/promocoes`)}
                            >
                              <History className="h-3 w-3 md:h-4 md:w-4 text-white" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isMobile ? 5 : 7} className="text-center p-4">
                        Não há militares cadastrados neste quadro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {Math.ceil(militares.length / itemsPerPage) > 1 && (
            <div className="p-2 md:p-4 flex justify-center">
              {Array.from({ length: Math.ceil(militares.length / itemsPerPage) }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  className="mx-1 h-6 w-6 md:h-8 md:w-8"
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
