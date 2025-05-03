
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const quadrosOficiais = [
    { id: "estado-maior", name: "QOEM - Estado-Maior", path: "/oficiais/estado-maior", count: 15 },
    { id: "especialistas", name: "QOE - Especialistas", path: "/oficiais/especialistas", count: 32 },
    { id: "reserva-oficiais", name: "QORR - Reserva Remunerada", path: "/oficiais/reserva", count: 24 },
  ];
  
  const quadrosPracas = [
    { id: "pracas-ativos", name: "QPBM - Praças Ativos", path: "/pracas/ativos", count: 120 },
    { id: "pracas-reserva", name: "QPRR - Reserva Remunerada", path: "/pracas/reserva", count: 45 },
  ];
  
  const outrosQuadros = [
    { id: "fixacao-vagas", name: "QFV - Fixação de Vagas", path: "/fixacao-vagas" },
    { id: "antiguidade", name: "QAA - Antiguidade", path: "/antiguidade" },
    { id: "merecimento", name: "QFM - Merecimento", path: "/merecimento" },
    { id: "legislacao", name: "Legislação", path: "/legislacao" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Painel de Controle</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Bem-vindo ao Sistema de Promoções do Corpo de Bombeiros Militar do Estado do Piauí (SysProm)
        </p>
      </div>
      
      {/* Oficiais Section */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white py-2 md:py-4">
          <CardTitle className="text-base md:text-lg">OFICIAIS</CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-200">Gerenciamento de Quadros de Oficiais</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 pt-3 md:pt-6">
          {quadrosOficiais.map((quadro) => (
            <Button
              key={quadro.id}
              variant="outline"
              className="h-auto p-2 md:p-4 justify-start flex flex-col items-stretch text-left"
              onClick={() => navigate(quadro.path)}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-sm md:text-base">{quadro.name}</span>
                <Badge variant="secondary">{quadro.count}</Badge>
              </div>
              <span className="text-muted-foreground text-xs mt-1 md:mt-2">Clique para gerenciar</span>
            </Button>
          ))}
        </CardContent>
      </Card>
      
      {/* Praças Section */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white py-2 md:py-4">
          <CardTitle className="text-base md:text-lg">PRAÇAS</CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-200">Gerenciamento de Quadros de Praças</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 pt-3 md:pt-6">
          {quadrosPracas.map((quadro) => (
            <Button
              key={quadro.id}
              variant="outline"
              className="h-auto p-2 md:p-4 justify-start flex flex-col items-stretch text-left"
              onClick={() => navigate(quadro.path)}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-sm md:text-base">{quadro.name}</span>
                <Badge variant="secondary">{quadro.count}</Badge>
              </div>
              <span className="text-muted-foreground text-xs mt-1 md:mt-2">Clique para gerenciar</span>
            </Button>
          ))}
        </CardContent>
      </Card>
      
      {/* Outros Quadros */}
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white py-2 md:py-4">
          <CardTitle className="text-base md:text-lg">OUTROS QUADROS</CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-200">Quadros Funcionais e Legislação</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 pt-3 md:pt-6">
          {outrosQuadros.map((quadro) => (
            <Button
              key={quadro.id}
              variant="outline"
              className="h-auto p-2 md:p-4 text-xs md:text-sm"
              onClick={() => navigate(quadro.path)}
            >
              {quadro.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
