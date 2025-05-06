
import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import "./sidebar.css";

export function SidebarMenu() {
  return (
    <Sidebar>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <img src="/cbmepi-logo.svg" alt="CBMEPI Logo" className="h-8 w-8" />
            <span className="text-lg">CBMEPI</span>
          </NavLink>
        </div>
        <ScrollArea className="flex-1 py-2">
          <SidebarSection>
            <SidebarLink icon={<Home className="h-4 w-4" />} href="/dashboard">
              Dashboard
            </SidebarLink>
            <SidebarLink icon={<Award className="h-4 w-4" />} href="/gestao-promocoes">
              Gestão de Promoções
            </SidebarLink>
            <SidebarLink icon={<List className="h-4 w-4" />} href="/merecimento">
              Quadro Merecimento
            </SidebarLink>
            <SidebarLink icon={<CheckSquare className="h-4 w-4" />} href="/antiguidade">
              Quadro Antiguidade
            </SidebarLink>
            <SidebarLink icon={<FileText className="h-4 w-4" />} href="/legislacao">
              Legislação
            </SidebarLink>
            <SidebarLink icon={<Clock className="h-4 w-4" />} href="/historico-promocoes">
              Histórico Promoções
            </SidebarLink>
            <SidebarLink icon={<BarChart2 className="h-4 w-4" />} href="/fixacao-vagas">
              Quadro Fixação Vagas
            </SidebarLink>
            <SidebarLink icon={<FileText className="h-4 w-4" />} href="/modelos-documentos">
              Modelos de Documentos
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="Cadastro">
            <SidebarLink icon={<UserPlus className="h-4 w-4" />} href="/cadastro-militar">
              Novo Militar
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="Militares">
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/oficiais/estado-maior">
              Oficiais Estado-Maior
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/oficiais/especialistas">
              Oficiais Especialistas
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/oficiais/saude">
              Oficiais de Saúde
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/oficiais/engenheiros">
              Oficiais Engenheiros
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/oficiais/complementares">
              Oficiais Complementares
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/oficiais/reserva">
              Oficiais Reserva
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/pracas/ativos">
              Praças Ativos
            </SidebarLink>
            <SidebarLink icon={<Users className="h-4 w-4" />} href="/pracas/reserva">
              Praças Reserva
            </SidebarLink>
          </SidebarSection>
        </ScrollArea>
      </div>
    </Sidebar>
  );
}
