
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Militar } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { toPostoPatente, toQuadroMilitar, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";

export const useFetchMilitares = (quadro: string) => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [filteredMilitares, setFilteredMilitares] = useState<Militar[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar militares do banco de dados
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

  // Função para filtrar militares com base na busca
  const filterMilitares = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredMilitares(militares);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = militares.filter(militar => 
      militar.nome.toLowerCase().includes(searchTermLower) ||
      militar.nomeGuerra?.toLowerCase().includes(searchTermLower) ||
      militar.posto.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredMilitares(filtered);
  }, [militares]);

  return {
    militares,
    filteredMilitares,
    loading,
    filterMilitares
  };
};
