
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Sidebar,
  SidebarProvider,
  SidebarContent, 
  ScrollArea 
} from "@/components/ui/sidebar";
import { SidebarSection } from "./SidebarSection";
import { SidebarLink } from "./SidebarLink";
import {
  Home,
  Users,
  Award,
  Bookmark,
  FileText,
  Clock,
  Settings,
  UserPlus,
  CheckSquare,
  List,
  Mail,
  BarChart2,
} from "lucide-react";

export function SidebarMenu() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <NavLink to="/" className="flex items-center gap-2 font-semibold">
              <img src="/cbmepi-logo.svg" alt="CBMEPI Logo" className="h-8 w-8" />
              <span className="text-lg">CBMEPI</span>
            </NavLink>
          </div>
          <ScrollArea className="flex-1 py-2">
            <SidebarSection title="NAVEGAÇÃO">
              <SidebarLink icon={<Home className="h-4 w-4" />} to="/dashboard">
                Dashboard
              </SidebarLink>
              <SidebarLink icon={<Award className="h-4 w-4" />} to="/gestao-promocoes">
                Gestão de Promoções
              </SidebarLink>
              <SidebarLink icon={<List className="h-4 w-4" />} to="/merecimento">
                Quadro Merecimento
              </SidebarLink>
              <SidebarLink icon={<CheckSquare className="h-4 w-4" />} to="/antiguidade">
                Quadro Antiguidade
              </SidebarLink>
              <SidebarLink icon={<FileText className="h-4 w-4" />} to="/legislacao">
                Legislação
              </SidebarLink>
              <SidebarLink icon={<Clock className="h-4 w-4" />} to="/historico-promocoes">
                Histórico Promoções
              </SidebarLink>
              <SidebarLink icon={<BarChart2 className="h-4 w-4" />} to="/fixacao-vagas">
                Quadro Fixação Vagas
              </SidebarLink>
              <SidebarLink icon={<FileText className="h-4 w-4" />} to="/modelos-documentos">
                Modelos de Documentos
              </SidebarLink>
            </SidebarSection>
            <SidebarSection title="CADASTRO">
              <SidebarLink icon={<UserPlus className="h-4 w-4" />} to="/cadastro-militar">
                Novo Militar
              </SidebarLink>
            </SidebarSection>
            <SidebarSection title="MILITARES">
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/oficiais/estado-maior">
                Oficiais Estado-Maior
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/oficiais/especialistas">
                Oficiais Especialistas
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/oficiais/saude">
                Oficiais de Saúde
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/oficiais/engenheiros">
                Oficiais Engenheiros
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/oficiais/complementares">
                Oficiais Complementares
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/oficiais/reserva">
                Oficiais Reserva
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/pracas/ativos">
                Praças Ativos
              </SidebarLink>
              <SidebarLink icon={<Users className="h-4 w-4" />} to="/pracas/reserva">
                Praças Reserva
              </SidebarLink>
            </SidebarSection>
          </ScrollArea>
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
