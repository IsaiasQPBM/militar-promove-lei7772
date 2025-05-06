
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Militar, CriterioPromocao, PostoPatente } from "@/types";
import { calcularProximaDataQuadroAcesso, verificarPeriodoQuadroAcesso } from "@/services/promocaoService";
import { FileText, AlertCircle, CheckCircle2, Clock, Search, CalendarDays, List, UserCheck, UserPlus } from "lucide-react";

const GestaoPromocoesComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("elegibilidade");
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [militaresElegiveis, setMilitaresElegiveis] = useState<Militar[]>([]);
  const [filteredMilitares, setFilteredMilitares] = useState<Militar[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [proximaDataQuadroAcesso, setProximaDataQuadroAcesso] = useState<Date | null>(null);
  const [isPeriodoQuadroAcesso, setIsPeriodoQuadroAcesso] = useState(false);
  const [filtroQuadro, setFiltroQuadro] = useState<string>("");
  const [filtroPosto, setFiltroPosto] = useState<string>("");
  
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carregar todos os militares ativos
        const { data, error } = await supabase
          .from("militares")
          .select("*")
          .eq("situacao", "ativo")
          .order("posto", { ascending: false })
          .order("dataultimapromocao", { ascending: true });
          
        if (error) throw error;
        
        // Converter os dados para o formato esperado
        if (data) {
          const militaresData: Militar[] = data.map(item => ({
            id: item.id,
            nome: item.nome,
            nomeCompleto: item.nome,
            nomeGuerra: item.nomeguerra || item.nome,
            posto: item.posto as PostoPatente,
            quadro: item.quadro as any,
            dataNascimento: item.datanascimento || "",
            dataInclusao: item.data_ingresso || "",
            dataUltimaPromocao: item.dataultimapromocao || "",
            situacao: item.situacao as any,
            tipoSanguineo: item.tipo_sanguineo as any,
            sexo: item.sexo as any,
            email: item.email,
            foto: item.foto,
            unidade: item.unidade
          }));
          
          setMilitares(militaresData);
          
          // Filtrar militares elegíveis para promoção
          const elegiveis = militaresData.filter(militar => {
            if (!militar.dataUltimaPromocao) return false;
            
            const dataUltimaPromocao = parseISO(militar.dataUltimaPromocao);
            const hoje = new Date();
            const diferencaMeses = (hoje.getFullYear() - dataUltimaPromocao.getFullYear()) * 12 + 
                                  hoje.getMonth() - dataUltimaPromocao.getMonth();
            
            // Verificar tempo mínimo de acordo com o posto
            const temposMinimos: Record<PostoPatente, number> = {
              "Coronel": 0, // Posto máximo
              "Tenente-Coronel": 36, // 3 anos em meses
              "Major": 48, // 4 anos em meses
              "Capitão": 48, // 4 anos em meses
              "1º Tenente": 48, // 4 anos em meses
              "2º Tenente": 36, // 3 anos em meses
              "Subtenente": 0, // Graduação máxima para praças
              "1º Sargento": 36, // 3 anos em meses
              "2º Sargento": 48, // 4 anos em meses
              "3º Sargento": 48, // 4 anos em meses
              "Cabo": 36, // 3 anos em meses
              "Soldado": 24, // 2 anos em meses
            };
            
            // Se o posto tem um tempo mínimo definido e já passou esse tempo
            if (temposMinimos[militar.posto] !== undefined && diferencaMeses >= temposMinimos[militar.posto]) {
              // Para os postos máximos, não há promoção
              if (militar.posto === "Coronel" || militar.posto === "Subtenente") {
                return false;
              }
              return true;
            }
            
            return false;
          });
          
          setMilitaresElegiveis(elegiveis);
          setFilteredMilitares(elegiveis);
        }
        
        // Calcular próxima data de inserção no quadro de acesso
        const proximaData = calcularProximaDataQuadroAcesso();
        setProximaDataQuadroAcesso(proximaData);
        
        // Verificar se estamos no período de inserção no quadro de acesso
        const emPeriodo = verificarPeriodoQuadroAcesso();
        setIsPeriodoQuadroAcesso(emPeriodo);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados dos militares.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  // Efeito para filtrar os militares quando os termos de busca ou filtros mudam
  useEffect(() => {
    if (activeTab === "elegibilidade") {
      let resultado = militaresElegiveis;
      
      // Aplicar filtro de busca
      if (searchTerm) {
        resultado = resultado.filter(militar => 
          militar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          militar.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) ||
          militar.posto.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Aplicar filtro de quadro
      if (filtroQuadro) {
        resultado = resultado.filter(militar => militar.quadro === filtroQuadro);
      }
      
      // Aplicar filtro de posto
      if (filtroPosto) {
        resultado = resultado.filter(militar => militar.posto === filtroPosto);
      }
      
      setFilteredMilitares(resultado);
    } else {
      let resultado = militares;
      
      // Aplicar filtro de busca
      if (searchTerm) {
        resultado = resultado.filter(militar => 
          militar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          militar.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) ||
          militar.posto.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Aplicar filtro de quadro
      if (filtroQuadro) {
        resultado = resultado.filter(militar => militar.quadro === filtroQuadro);
      }
      
      // Aplicar filtro de posto
      if (filtroPosto) {
        resultado = resultado.filter(militar => militar.posto === filtroPosto);
      }
      
      setFilteredMilitares(resultado);
    }
  }, [searchTerm, filtroQuadro, filtroPosto, activeTab, militares, militaresElegiveis]);
  
  // Determinar o critério de promoção com base no posto
  const getCriterioPromocao = (posto: PostoPatente): CriterioPromocao => {
    if (["2º Tenente", "1º Tenente", "Soldado", "Cabo", "3º Sargento", "2º Sargento"].includes(posto)) {
      return "Antiguidade";
    } else if (["Major", "Tenente-Coronel", "Capitão", "1º Sargento"].includes(posto)) {
      return "Merecimento";
    } else if (posto === "Coronel") {
      return "Posto máximo";
    } else if (posto === "Subtenente") {
      return "Graduação máxima";
    }
    return "Antiguidade";
  };
  
  // Determinar o próximo posto com base no posto atual
  const getProximoPosto = (posto: PostoPatente): PostoPatente | null => {
    const postos: PostoPatente[] = [
      "Soldado",
      "Cabo",
      "3º Sargento",
      "2º Sargento",
      "1º Sargento",
      "Subtenente",
      "2º Tenente",
      "1º Tenente",
      "Capitão",
      "Major",
      "Tenente-Coronel",
      "Coronel",
    ];
    
    const index = postos.indexOf(posto);
    if (index === -1 || index === postos.length - 1) return null;
    
    return postos[index + 1];
  };
  
  // Obter a cor do status de acordo com o critério de promoção
  const getStatusBadgeColor = (criterio: CriterioPromocao): string => {
    switch (criterio) {
      case "Antiguidade":
        return "bg-blue-500 hover:bg-blue-600";
      case "Merecimento":
        return "bg-purple-500 hover:bg-purple-600";
      case "Posto máximo":
      case "Graduação máxima":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Função para formatar a data no padrão brasileiro
  const formatarData = (data: string | null): string => {
    if (!data) return "Data não disponível";
    try {
      return format(parseISO(data), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  // Função para calcular o tempo desde a última promoção
  const calcularTempoDesdeUltimaPromocao = (data: string | null): string => {
    if (!data) return "Sem registro";
    
    try {
      const dataPromocao = parseISO(data);
      const hoje = new Date();
      
      const diferencaAnos = hoje.getFullYear() - dataPromocao.getFullYear();
      const diferencaMeses = hoje.getMonth() - dataPromocao.getMonth();
      
      let anos = diferencaAnos;
      let meses = diferencaMeses;
      
      if (meses < 0) {
        anos--;
        meses += 12;
      }
      
      if (anos === 0) {
        return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
      } else {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
      }
    } catch (error) {
      return "Data inválida";
    }
  };
  
  // Renderizar a página de gestão de promoções
  return (
    <div className="space-y-6">
      <Card className="bg-gray-50 border-blue-500 border-t-4">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">Status do Quadro de Acesso</h2>
              {isPeriodoQuadroAcesso ? (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Período de inclusão ativo
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Os militares elegíveis podem ser incluídos no Quadro de Acesso.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="border-amber-500 text-amber-600">
                    <Clock className="h-4 w-4 mr-1" /> Aguardando período de inclusão
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Próxima data de inclusão: {proximaDataQuadroAcesso && format(proximaDataQuadroAcesso, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/historico-promocoes")}
              >
                <FileText className="h-4 w-4" /> Histórico de Promoções
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/merecimento")}
              >
                <List className="h-4 w-4" /> Quadro de Merecimento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="elegibilidade" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" /> Elegíveis para Promoção
          </TabsTrigger>
          <TabsTrigger value="militares" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Todos os Militares
          </TabsTrigger>
        </TabsList>
        
        <Card className="mt-4 border-t-0 rounded-t-none">
          <CardContent className="pt-6">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar militar..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filtroQuadro} onValueChange={setFiltroQuadro}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por Quadro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Quadros</SelectItem>
                    <SelectItem value="QOEM">QOEM</SelectItem>
                    <SelectItem value="QOE">QOE</SelectItem>
                    <SelectItem value="QOBM-S">QOBM-S</SelectItem>
                    <SelectItem value="QOBM-E">QOBM-E</SelectItem>
                    <SelectItem value="QOBM-C">QOBM-C</SelectItem>
                    <SelectItem value="QPBM">QPBM</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filtroPosto} onValueChange={setFiltroPosto}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por Posto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Postos</SelectItem>
                    <SelectItem value="Coronel">Coronel</SelectItem>
                    <SelectItem value="Tenente-Coronel">Tenente-Coronel</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Capitão">Capitão</SelectItem>
                    <SelectItem value="1º Tenente">1º Tenente</SelectItem>
                    <SelectItem value="2º Tenente">2º Tenente</SelectItem>
                    <SelectItem value="Subtenente">Subtenente</SelectItem>
                    <SelectItem value="1º Sargento">1º Sargento</SelectItem>
                    <SelectItem value="2º Sargento">2º Sargento</SelectItem>
                    <SelectItem value="3º Sargento">3º Sargento</SelectItem>
                    <SelectItem value="Cabo">Cabo</SelectItem>
                    <SelectItem value="Soldado">Soldado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="elegibilidade" className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando militares elegíveis...</p>
                </div>
              ) : filteredMilitares.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Militar</TableHead>
                        <TableHead>Posto Atual</TableHead>
                        <TableHead>Próximo Posto</TableHead>
                        <TableHead>Última Promoção</TableHead>
                        <TableHead>Tempo no Posto</TableHead>
                        <TableHead>Critério</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMilitares.map((militar) => {
                        const proximoPosto = getProximoPosto(militar.posto);
                        const criterio = getCriterioPromocao(militar.posto);
                        const statusColor = getStatusBadgeColor(criterio);
                        
                        return (
                          <TableRow key={militar.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {militar.foto ? (
                                    <img src={militar.foto} alt={militar.nomeGuerra} className="w-full h-full object-cover" />
                                  ) : (
                                    militar.nomeGuerra.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <div>{militar.nomeGuerra}</div>
                                  <div className="text-xs text-gray-500">{militar.quadro}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-semibold">
                                {militar.posto}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {proximoPosto ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {proximoPosto}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                  N/A
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                                <span>{formatarData(militar.dataUltimaPromocao)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {calcularTempoDesdeUltimaPromocao(militar.dataUltimaPromocao)}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColor}>
                                {criterio}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/ficha-militar/${militar.id}`)}
                                >
                                  Ver Ficha
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate(`/historico-promocoes/${militar.id}`)}
                                  className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                                >
                                  Histórico
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-semibold text-lg">Nenhum militar elegível encontrado</h3>
                  <p className="text-gray-500 max-w-md mt-1">
                    Não há militares que atendam aos critérios para promoção no momento ou com os filtros aplicados.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="militares" className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando militares...</p>
                </div>
              ) : filteredMilitares.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Militar</TableHead>
                        <TableHead>Posto</TableHead>
                        <TableHead>Última Promoção</TableHead>
                        <TableHead>Tempo no Posto</TableHead>
                        <TableHead>Quadro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMilitares.map((militar) => (
                        <TableRow key={militar.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {militar.foto ? (
                                  <img src={militar.foto} alt={militar.nomeGuerra} className="w-full h-full object-cover" />
                                ) : (
                                  militar.nomeGuerra.charAt(0)
                                )}
                              </div>
                              <div>
                                <div>{militar.nomeGuerra}</div>
                                <div className="text-xs text-gray-500">{militar.nome}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-semibold">
                              {militar.posto}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                              <span>{formatarData(militar.dataUltimaPromocao)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {calcularTempoDesdeUltimaPromocao(militar.dataUltimaPromocao)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {militar.quadro}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/ficha-militar/${militar.id}`)}
                              >
                                Ver Ficha
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => navigate(`/historico-promocoes/${militar.id}`)}
                                className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
                              >
                                Histórico
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-semibold text-lg">Nenhum militar encontrado</h3>
                  <p className="text-gray-500 max-w-md mt-1">
                    Não foram encontrados militares que correspondam aos critérios de busca.
                  </p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default GestaoPromocoesComponent;
