
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Militar } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileEdit, Eye, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";

interface QuadroPracasProps {
  quadro: string;
  titulo: string;
}

const QuadroPracas: React.FC<QuadroPracasProps> = ({ quadro, titulo }) => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [filteredMilitares, setFilteredMilitares] = useState<Militar[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("quadro", quadro)
          .eq("situacao", "ativo");

        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Militar interface
          const transformedData: Militar[] = data.map(item => ({
            id: item.id,
            nome: item.nome,
            nomeCompleto: item.nome,
            nomeGuerra: item.nomeguerra || item.nome,
            posto: toPostoPatente(item.posto),
            quadro: toQuadroMilitar(item.quadro),
            dataNascimento: item.datanascimento || "",
            dataInclusao: item.data_ingresso || "",
            dataUltimaPromocao: item.dataultimapromocao || "",
            situacao: toSituacaoMilitar(item.situacao),
            tipoSanguineo: toTipoSanguineo(item.tipo_sanguineo),
            sexo: toSexo(item.sexo),
            email: item.email,
            foto: item.foto,
            unidade: item.unidade
          }));
          
          setMilitares(transformedData);
          setFilteredMilitares(transformedData);
        }
      } catch (error) {
        console.error("Erro ao buscar militares:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMilitares();
  }, [quadro]);

  // Filtrar militares quando o termo de busca mudar
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMilitares(militares);
      return;
    }

    const filtered = militares.filter(militar => 
      militar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      militar.nomeGuerra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      militar.posto.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredMilitares(filtered);
  }, [searchTerm, militares]);

  const handleViewMilitar = (id: string) => {
    navigate(`/ficha-militar/${id}`);
  };

  const handleEditMilitar = (id: string) => {
    navigate(`/editar-militar/${id}`);
  };

  const handleAddMilitar = () => {
    navigate("/cadastro-militar");
  };

  const renderPostoGraduacao = (posto: string) => {
    const postoBadgeClass = {
      "Subtenente": "bg-emerald-100 text-emerald-800",
      "1º Sargento": "bg-cyan-100 text-cyan-800",
      "2º Sargento": "bg-sky-100 text-sky-800",
      "3º Sargento": "bg-blue-100 text-blue-800",
      "Cabo": "bg-indigo-100 text-indigo-800",
      "Soldado": "bg-violet-100 text-violet-800",
    }[posto] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${postoBadgeClass}`}>
        {posto}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>{titulo}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar militar..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filtrar
              </Button>
              <Button onClick={handleAddMilitar} className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple">
                <Plus className="h-4 w-4 mr-1" /> Novo Militar
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando militares...</p>
            </div>
          ) : filteredMilitares.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMilitares.map((militar) => (
                <Card key={militar.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        {militar.foto ? (
                          <img
                            src={militar.foto}
                            alt={militar.nomeGuerra || militar.nome}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {(militar.nomeGuerra || militar.nome).charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{militar.nomeGuerra || militar.nome}</h3>
                          <div className="mt-1">{renderPostoGraduacao(militar.posto)}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600 truncate">
                        {militar.nome}
                      </div>
                    </div>
                    <div className="border-t flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-none h-10"
                        onClick={() => handleViewMilitar(militar.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Ver Ficha
                      </Button>
                      <div className="border-l" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-none h-10"
                        onClick={() => handleEditMilitar(militar.id)}
                      >
                        <FileEdit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
