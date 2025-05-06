
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Militar } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useFetchMilitares } from "@/hooks/useFetchMilitares";
import { MilitarCard } from "@/components/quadros/MilitarCard";
import { MilitarSearchFilter } from "@/components/quadros/MilitarSearchFilter";

interface QuadroPracasProps {
  quadro: string;
  titulo: string;
}

const QuadroPracas: React.FC<QuadroPracasProps> = ({ quadro, titulo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { militares, filteredMilitares, loading, filterMilitares } = useFetchMilitares(quadro);

  // Filtrar militares quando o termo de busca mudar
  useEffect(() => {
    filterMilitares(searchTerm);
  }, [searchTerm, filterMilitares]);

  const handleAddMilitar = () => {
    navigate("/cadastro-militar");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>{titulo}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <MilitarSearchFilter 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            handleAddMilitar={handleAddMilitar}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando militares...</p>
            </div>
          ) : filteredMilitares.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMilitares.map((militar) => (
                <MilitarCard 
                  key={militar.id} 
                  militar={militar} 
                  onView={() => navigate(`/ficha-militar/${militar.id}`)}
                  onEdit={() => navigate(`/editar-militar/${militar.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum militar encontrado no quadro {quadro}.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleAddMilitar}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Militar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuadroPracas;
