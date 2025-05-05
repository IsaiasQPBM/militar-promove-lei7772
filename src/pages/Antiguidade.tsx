
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Militar } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MilitarList } from "@/components/antiguidade/MilitarList";
import { CriteriosAntiguidade } from "@/components/antiguidade/CriteriosAntiguidade";
import { toQuadroMilitar, toPostoPatente, toSituacaoMilitar, toTipoSanguineo, toSexo } from "@/utils/typeConverters";

// Component to display a group of militares in a table
type MilitarTableProps = {
  militares: Militar[];
  loading: boolean;
  tipo: "oficiais" | "pracas";
  titulo: string;
};

const MilitarTable = ({ militares, loading, tipo, titulo }: MilitarTableProps) => {
  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MilitarList 
          militares={militares} 
          loading={loading} 
          tipo={tipo}
        />
      </CardContent>
    </Card>
  );
};

const Antiguidade = () => {
  const [tabValue, setTabValue] = useState("oficiais");
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMilitares = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo");
          
        if (error) throw error;
        
        // Convert data from database format to Militar type format
        const militaresFormatados: Militar[] = data.map(item => ({
          id: item.id,
          nome: item.nome,
          nomeCompleto: item.nome,
          nomeGuerra: item.nomeguerra || item.nome,
          posto: toPostoPatente(item.posto),
          quadro: toQuadroMilitar(item.quadro),
          dataNascimento: item.datanascimento,
          dataInclusao: item.data_ingresso,
          dataUltimaPromocao: item.dataultimapromocao,
          situacao: toSituacaoMilitar(item.situacao),
          email: item.email,
          foto: item.foto,
          tipoSanguineo: toTipoSanguineo(item.tipo_sanguineo),
          sexo: toSexo(item.sexo),
          unidade: item.unidade
        }));
        
        setMilitares(militaresFormatados);
      } catch (error) {
        console.error("Error fetching militares:", error);
        toast({
          title: "Error loading data",
          description: "Could not load militar data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilitares();
  }, []);
  
  // Function to sort militares by seniority
  const ordenarPorAntiguidade = (militares: Militar[]): Militar[] => {
    return [...militares].sort((a, b) => {
      // First criterion: Date of inclusion (earliest first)
      const dataInclusaoA = new Date(a.dataInclusao).getTime();
      const dataInclusaoB = new Date(b.dataInclusao).getTime();
      if (dataInclusaoA !== dataInclusaoB) {
        return dataInclusaoA - dataInclusaoB;
      }
      
      // Second criterion: Date of last promotion (earliest first)
      const dataPromocaoA = new Date(a.dataUltimaPromocao).getTime();
      const dataPromocaoB = new Date(b.dataUltimaPromocao).getTime();
      if (dataPromocaoA !== dataPromocaoB) {
        return dataPromocaoA - dataPromocaoB;
      }
      
      // Third criterion: Date of birth (oldest first)
      const dataNascimentoA = new Date(a.dataNascimento).getTime();
      const dataNascimentoB = new Date(b.dataNascimento).getTime();
      return dataNascimentoA - dataNascimentoB;
    });
  };
  
  // Filter and prepare data
  const oficiais = militares.filter(m => 
    (m.quadro === "QOEM" || m.quadro === "QOE") && m.situacao === "ativo"
  );
  
  const pracas = militares.filter(m => 
    m.quadro === "QPBM" && m.situacao === "ativo"
  );
  
  // Sort by seniority
  const oficiaisOrdenados = ordenarPorAntiguidade(oficiais);
  const pracasOrdenadas = ordenarPorAntiguidade(pracas);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Acesso por Antiguidade (QAA)</h1>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="oficiais">Oficiais</TabsTrigger>
          <TabsTrigger value="pracas">Praças</TabsTrigger>
        </TabsList>
        
        <TabsContent value="oficiais">
          <MilitarTable 
            militares={oficiaisOrdenados} 
            loading={loading} 
            tipo="oficiais"
            titulo="Quadro de Acesso por Antiguidade - Oficiais"
          />
        </TabsContent>
        
        <TabsContent value="pracas">
          <MilitarTable 
            militares={pracasOrdenadas} 
            loading={loading} 
            tipo="pracas"
            titulo="Quadro de Acesso por Antiguidade - Praças"
          />
        </TabsContent>
      </Tabs>
      
      <CriteriosAntiguidade />
    </div>
  );
};

export default Antiguidade;
