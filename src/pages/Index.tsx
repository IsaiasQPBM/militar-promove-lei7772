
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 rounded-lg p-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">Sistema de Promoções CBMEPI</h1>
        <p className="text-xl text-gray-600 mb-8">
          Bem-vindo ao Sistema de Gestão de Promoções do Corpo de Bombeiros Militar do Estado do Piauí
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Button 
            variant="outline" 
            size="lg" 
            className="p-6 h-auto flex flex-col items-center"
            onClick={() => navigate('/fixacao-vagas')}
          >
            <span className="text-lg font-semibold mb-2">Quadro de Fixação de Vagas</span>
            <span className="text-sm text-gray-500">Visualize a disponibilidade de vagas</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="p-6 h-auto flex flex-col items-center"
            onClick={() => navigate('/cadastro-militar')}
          >
            <span className="text-lg font-semibold mb-2">Cadastrar Militar</span>
            <span className="text-sm text-gray-500">Adicione novos militares ao sistema</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="p-6 h-auto flex flex-col items-center"
            onClick={() => navigate('/gestao-promocoes')}
          >
            <span className="text-lg font-semibold mb-2">Gestão de Promoções</span>
            <span className="text-sm text-gray-500">Gerencie o processo de promoções</span>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          Para mais funcionalidades, utilize o menu lateral de navegação.
        </p>
      </div>
    </div>
  );
};

export default Index;
