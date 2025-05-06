
import React from "react";
import { 
  Users, 
  BarChart2, 
  FileText, 
  ShieldCheck, 
  Award, 
  Grid3X3, 
  ClipboardList,
  UserPlus,
  Database,
  FileUp,
  Settings,
  Gavel
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarSection } from "./SidebarSection";
import { SidebarLink } from "./SidebarLink";

export function SidebarMenu() {
  return (
    <Sidebar className="border-r bg-cbmepi-darkPurple text-white">
      <div className="flex flex-col h-full pt-4">
        <div className="space-y-1 px-3">
          <SidebarLink 
            href="/" 
            icon={<BarChart2 className="h-5 w-5" />}
            label="Dashboard" 
          />
        </div>
        
        <SidebarSection title="Gerenciamento">
          <SidebarLink 
            href="/cadastro-militar"
            icon={<UserPlus className="h-5 w-5" />} 
            label="Cadastrar Militar" 
          />
          <SidebarLink 
            href="/quadros/oficiais" 
            icon={<Users className="h-5 w-5" />} 
            label="Quadro Oficiais" 
          />
          <SidebarLink 
            href="/quadros/pracas" 
            icon={<Users className="h-5 w-5" />} 
            label="Quadro Praças" 
          />
          <SidebarLink 
            href="/importar-militares" 
            icon={<FileUp className="h-5 w-5" />} 
            label="Importar Militares" 
          />
        </SidebarSection>
        
        <SidebarSection title="Promoções">
          <SidebarLink 
            href="/gestao-promocoes" 
            icon={<ShieldCheck className="h-5 w-5" />} 
            label="Gestão de Promoções" 
          />
          <SidebarLink 
            href="/antiguidade" 
            icon={<ClipboardList className="h-5 w-5" />} 
            label="Critério Antiguidade" 
          />
          <SidebarLink 
            href="/merecimento" 
            icon={<Award className="h-5 w-5" />} 
            label="Critério Merecimento" 
          />
          <SidebarLink 
            href="/fixacao-vagas" 
            icon={<Grid3X3 className="h-5 w-5" />} 
            label="Quadro Fixação de Vagas" 
          />
          <SidebarLink 
            href="/historico-promocoes" 
            icon={<FileText className="h-5 w-5" />} 
            label="Histórico de Promoções" 
          />
        </SidebarSection>
        
        <SidebarSection title="Sistema">
          <SidebarLink 
            href="/legislacao" 
            icon={<Gavel className="h-5 w-5" />} 
            label="Legislação" 
          />
          <SidebarLink 
            href="/importar-militares-ai" 
            icon={<Database className="h-5 w-5" />} 
            label="Importação AI" 
          />
          <SidebarLink 
            href="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Configurações" 
          />
        </SidebarSection>
        
        <div className="mt-auto p-4 text-center text-sm text-white/60">
          SysProm - v1.0.0
          <div className="text-xs mt-1">CBMEPI © 2025</div>
        </div>
      </div>
    </Sidebar>
  );
}
