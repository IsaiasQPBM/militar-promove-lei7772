
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  User, 
  Users, 
  Award, 
  Clock, 
  TrendingUp,
  LogOut,
  Star 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="w-64 bg-cbmepi-purple text-white overflow-y-auto">
      <div className="p-4">
        {/* Oficiais Section */}
        <div className="mb-6">
          <div className="bg-purple-900 text-center py-2 mb-2 font-bold">
            OFICIAIS
          </div>
          
          <div className="space-y-1">
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
              icon={<Award className="h-5 w-5" />}
            >
              QFM - Merecimento
            </SidebarLink>
          </div>
        </div>
        
        {/* Praças Section */}
        <div className="mb-6">
          <div className="bg-purple-900 text-center py-2 mb-2 font-bold">
            PRAÇAS
          </div>
          
          <div className="space-y-1">
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
          </div>
        </div>
        
        {/* Legislação Section */}
        <div className="mb-6">
          <div className="bg-purple-900 text-center py-2 mb-2 font-bold">
            LEGISLAÇÃO
          </div>
          
          <div className="space-y-1">
            <SidebarLink 
              to="/legislacao" 
              active={isActive("/legislacao")}
              icon={<FileText className="h-5 w-5" />}
            >
              Lei 7.772 DE 04/04/2022
            </SidebarLink>
          </div>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-2 px-4 py-2 text-white hover:bg-cbmepi-darkPurple rounded-md transition-colors mt-8"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  iconBg?: string;
  iconShape?: "circle" | "triangle";
}

const SidebarLink = ({ to, active, children, icon, iconBg, iconShape = "circle" }: SidebarLinkProps) => {
  const renderIcon = () => {
    if (!iconBg) {
      return <div className="w-5">{icon}</div>;
    }
    
    if (iconShape === "triangle") {
      return (
        <div className={cn("flex items-center justify-center", iconBg)} style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", width: "20px", height: "20px" }}>
          {icon}
        </div>
      );
    }
    
    return (
      <div className={cn("rounded-full p-0.5 flex items-center justify-center", iconBg)}>
        {icon}
      </div>
    );
  };
  
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
        active ? "bg-cbmepi-darkPurple" : "hover:bg-cbmepi-lightPurple"
      )}
    >
      {renderIcon()}
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};
