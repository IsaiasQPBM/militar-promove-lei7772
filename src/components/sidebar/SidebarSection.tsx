
import React from 'react';
import { Users, UserCircle, UserPlus, FileDown, Calendar, Award, Scale, BookOpen, ClipboardList, ChevronDown, ChevronUp, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarLink from './SidebarLink';

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
  children?: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  isOpen,
  toggleOpen,
  children
}) => {
  return (
    <div className="border-b border-gray-200 pb-1">
      <Button
        variant="ghost"
        className="flex w-full justify-between p-2 text-gray-700 hover:bg-gray-100"
        onClick={toggleOpen}
        size="sm"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </Button>
      {isOpen && (
        <div className="flex flex-col gap-1">{children}</div>
      )}
    </div>
  );
};

// Componente para a seção de efetivo
export const EfetivoSection: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ isOpen, toggleOpen }) => {
  return (
    <SidebarSection
      title="Efetivo"
      icon={<Users className="h-4 w-4" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <SidebarLink to="/oficiais/estado-maior">Oficiais Estado-Maior</SidebarLink>
      <SidebarLink to="/oficiais/especialistas">Oficiais Especialistas</SidebarLink>
      <SidebarLink to="/oficiais/reserva">Oficiais Reserva</SidebarLink>
      <SidebarLink to="/pracas/ativos">Praças Ativos</SidebarLink>
      <SidebarLink to="/pracas/reserva">Praças Reserva</SidebarLink>
    </SidebarSection>
  );
};

// Componente para a seção de gestão
export const GestaoSection: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ isOpen, toggleOpen }) => {
  return (
    <SidebarSection
      title="Gestão de Cadastro"
      icon={<UserCircle className="h-4 w-4" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <SidebarLink to="/cadastro/militar">Cadastrar Militar</SidebarLink>
      <SidebarLink to="/importar/militares">Importar Militares</SidebarLink>
    </SidebarSection>
  );
};

// Componente para a seção de gestão
export const ControlePromocoesSection: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ isOpen, toggleOpen }) => {
  return (
    <SidebarSection
      title="Controle de Promoções"
      icon={<Award className="h-4 w-4" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <SidebarLink to="/antiguidade">Quadro de Antiguidade</SidebarLink>
      <SidebarLink to="/merecimento">Quadro Merecimento</SidebarLink>
      <SidebarLink to="/gestao/promocoes">Gestão de Promoções</SidebarLink>
      <SidebarLink to="/proximos-promocao">Próximos da Promoção</SidebarLink>
    </SidebarSection>
  );
};

// Componente para a seção de quadro de vagas
export const QuadroVagasSection: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ isOpen, toggleOpen }) => {
  return (
    <SidebarSection
      title="Quadro de Vagas"
      icon={<ClipboardList className="h-4 w-4" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <SidebarLink to="/fixacao-vagas">Fixação de Vagas</SidebarLink>
    </SidebarSection>
  );
};

// Componente para a se
export const LegislacaoSection: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ isOpen, toggleOpen }) => {
  return (
    <SidebarSection
      title="Legislação"
      icon={<BookOpen className="h-4 w-4" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <SidebarLink to="/legislacao">Base Legal</SidebarLink>
    </SidebarSection>
  );
};

// Seção de Dashboard
export const DashboardSection: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ isOpen, toggleOpen }) => {
  return (
    <SidebarSection
      title="Painéis"
      icon={<BarChart className="h-4 w-4" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <SidebarLink to="/dashboard">Painel Geral</SidebarLink>
    </SidebarSection>
  );
};
