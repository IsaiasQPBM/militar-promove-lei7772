
import { useLocation } from "react-router-dom";
import { 
  FileText, 
  Clock, 
  Award,
  LogOut,
  Star,
  Users,
  TrendingUp,
  Upload,
  UserPlus,
  Settings,
  Import,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  const auth = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const handleSignOut = () => {
    console.log("Sign out clicked");
    // Use auth.signOut when it's available
  };
  
  return (
    <div className={cn("pb-12 w-full sm:max-w-[260px]")}>
      <div className="space-y-4 py-4">
        <SidebarSection title="OFICIAIS">
          <SidebarLink 
            to="/oficiais/estado-maior" 
            active={isActive("/oficiais/estado-maior")}
            icon={<Star className="h-5 w-5" />}
            iconBg="bg-cbmepi-yellow"
          >
            QOEM - Estado-Maior
          </SidebarLink>
          
          <SidebarLink 
            to="/oficiais/especialistas" 
            active={isActive("/oficiais/especialistas")}
            icon={<Star className="h-5 w-5" />}
            iconBg="bg-cbmepi-yellow"
          >
            QOE - Especialistas
          </SidebarLink>
          
          <SidebarLink 
            to="/oficiais/reserva" 
            active={isActive("/oficiais/reserva")}
            icon={<Star className="h-5 w-5" />}
            iconBg="bg-cbmepi-yellow"
          >
            QORR - Reserva Remunerada
          </SidebarLink>
        </SidebarSection>
        
        <SidebarSection title="PRAÇAS">
          <SidebarLink 
            to="/pracas/ativos" 
            active={isActive("/pracas/ativos")}
            icon={<Users className="h-5 w-5" />}
            iconBg="bg-orange-500"
            iconShape="triangle"
          >
            QPBM - ATIVOS
          </SidebarLink>
          
          <SidebarLink 
            to="/pracas/reserva" 
            active={isActive("/pracas/reserva")}
            icon={<Users className="h-5 w-5" />}
            iconBg="bg-orange-500"
            iconShape="triangle"
          >
            QPRR - Reserva Remunerada
          </SidebarLink>
        </SidebarSection>
        
        <SidebarSection title="QUADROS">
          <SidebarLink 
            to="/fixacao-vagas" 
            active={isActive("/fixacao-vagas")}
            icon={<FileText className="h-5 w-5" />}
          >
            QFV - Fixação de Vagas
          </SidebarLink>
          
          <SidebarLink 
            to="/antiguidade" 
            active={isActive("/antiguidade")}
            icon={<Clock className="h-5 w-5" />}
          >
            QAA - Antiguidade
          </SidebarLink>
          
          <SidebarLink 
            to="/merecimento" 
            active={isActive("/merecimento")}
            icon={<TrendingUp className="h-5 w-5" />}
          >
            QFM - Merecimento
          </SidebarLink>
        </SidebarSection>
        
        <SidebarSection title="PROMOÇÕES">
          <SidebarLink 
            to="/gestao-promocoes" 
            active={isActive("/gestao-promocoes")}
            icon={<Award className="h-5 w-5" />}
          >
            Gestão de Promoções
          </SidebarLink>
        </SidebarSection>
        
        <SidebarSection title="LEGISLAÇÃO">
          <SidebarLink 
            to="/legislacao" 
            active={isActive("/legislacao")}
            icon={<FileText className="h-5 w-5" />}
          >
            Lei 7.772 DE 04/04/2022
          </SidebarLink>
        </SidebarSection>
        
        <SidebarSection title="CADASTRO">
          <SidebarLink 
            to="/cadastro-militar" 
            active={isActive("/cadastro-militar")}
            icon={<UserPlus className="h-5 w-5" />}
          >
            Cadastrar Militar
          </SidebarLink>
          
          <SidebarLink 
            to="/importar-militares" 
            active={isActive("/importar-militares")}
            icon={<Import className="h-5 w-5" />}
          >
            Importar Militares
          </SidebarLink>
          
          <SidebarLink 
            to="/importar-militares-ai" 
            active={isActive("/importar-militares-ai")}
            icon={<Upload className="h-5 w-5" />}
          >
            Importar com IA
          </SidebarLink>
        </SidebarSection>
        
        <SidebarSection title="DOCUMENTOS">
          <SidebarLink 
            to="/modelo-documentos" 
            active={isActive("/modelo-documentos")}
            icon={<FileText className="h-4 w-4" />}
          >
            Modelos de Documentos
          </SidebarLink>
        </SidebarSection>
        
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center space-x-2 px-4 py-2 text-white hover:bg-cbmepi-darkPurple rounded-md transition-colors mt-8"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
}
