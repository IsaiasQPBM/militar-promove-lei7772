
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";
import {
  Home,
  Users,
  BookOpen,
  FileText,
  Award,
  BarChart2,
  LogOut,
  Upload,
  FileSearch
} from "lucide-react";

export const SidebarMenu: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className={`pb-12 w-full sm:max-w-[260px] ${collapsed ? 'sm:max-w-[64px]' : 'sm:max-w-[260px]'}`}>
      <div className="space-y-4 py-4">
        <SidebarSection title="Menu Principal">
          <SidebarLink to="/dashboard" icon={<Home />} active={isActive("/") || isActive("/dashboard")}>
            Dashboard
          </SidebarLink>
        </SidebarSection>

        <SidebarSection title="Militares">
          <SidebarLink to="/quadros/oficiais" icon={<Users />} active={isActive("/quadros/oficiais")}>
            Quadro de Oficiais
          </SidebarLink>
          <SidebarLink to="/quadros/pracas" icon={<Users />} active={isActive("/quadros/pracas")}>
            Quadro de Praças
          </SidebarLink>
        </SidebarSection>

        <SidebarSection title="Gerenciamento">
          <SidebarLink to="/qfv" icon={<FileText />} active={isActive("/qfv")}>
            Quadro de Fixação de Vagas
          </SidebarLink>
          <SidebarLink to="/gestao-promocoes" icon={<Award />} active={isActive("/gestao-promocoes")}>
            Gestão de Promoções
          </SidebarLink>
          <SidebarLink to="/legislacao" icon={<BookOpen />} active={isActive("/legislacao")}>
            Legislação
          </SidebarLink>
          <SidebarLink to="/relatorios" icon={<BarChart2 />} active={isActive("/relatorios")}>
            Relatórios
          </SidebarLink>
        </SidebarSection>

        <SidebarSection title="Importação">
          <SidebarLink to="/importacao-ai" icon={<Upload />} active={isActive("/importacao-ai")}>
            Importar com IA
          </SidebarLink>
          <SidebarLink to="/pdf-scanner" icon={<FileSearch />} active={isActive("/pdf-scanner")}>
            Extrair de PDF
          </SidebarLink>
        </SidebarSection>

        <div className="px-3 py-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-600 rounded-md hover:bg-gray-100 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
