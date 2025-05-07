
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";
import { Sidebar } from "./Sidebar";
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
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
      <div className="space-y-4 py-4">
        <SidebarSection title="Menu Principal">
          <SidebarLink to="/dashboard" icon={<Home />} text="Dashboard" active={isActive("/") || isActive("/dashboard")} />
        </SidebarSection>

        <SidebarSection title="Militares">
          <SidebarLink to="/quadros/oficiais" icon={<Users />} text="Quadro de Oficiais" active={isActive("/quadros/oficiais")} />
          <SidebarLink to="/quadros/pracas" icon={<Users />} text="Quadro de Praças" active={isActive("/quadros/pracas")} />
        </SidebarSection>

        <SidebarSection title="Gerenciamento">
          <SidebarLink to="/qfv" icon={<FileText />} text="Quadro de Fixação de Vagas" active={isActive("/qfv")} />
          <SidebarLink to="/gestao-promocoes" icon={<Award />} text="Gestão de Promoções" active={isActive("/gestao-promocoes")} />
          <SidebarLink to="/legislacao" icon={<BookOpen />} text="Legislação" active={isActive("/legislacao")} />
          <SidebarLink to="/relatorios" icon={<BarChart2 />} text="Relatórios" active={isActive("/relatorios")} />
        </SidebarSection>

        <SidebarSection title="Importação">
          <SidebarLink to="/importacao-ai" icon={<Upload />} text="Importar com IA" active={isActive("/importacao-ai")} />
          <SidebarLink to="/pdf-scanner" icon={<FileSearch />} text="Extrair de PDF" active={isActive("/pdf-scanner")} />
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
    </Sidebar>
  );
};
