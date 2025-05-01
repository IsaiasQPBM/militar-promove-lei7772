
import { useState } from 'react';
import { EfetivoSection, GestaoSection, ControlePromocoesSection, QuadroVagasSection, LegislacaoSection, DashboardSection } from './SidebarSection';

function Sidebar() {
  const [openSections, setOpenSections] = useState({
    dashboard: true,
    efetivo: false,
    gestao: false,
    promocoes: false,
    quadro: false,
    legislacao: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col overflow-y-auto h-full py-4 px-3">
        <DashboardSection 
          isOpen={openSections.dashboard} 
          toggleOpen={() => toggleSection('dashboard')} 
        />
        <EfetivoSection 
          isOpen={openSections.efetivo} 
          toggleOpen={() => toggleSection('efetivo')} 
        />
        <GestaoSection 
          isOpen={openSections.gestao} 
          toggleOpen={() => toggleSection('gestao')} 
        />
        <ControlePromocoesSection 
          isOpen={openSections.promocoes} 
          toggleOpen={() => toggleSection('promocoes')} 
        />
        <QuadroVagasSection 
          isOpen={openSections.quadro} 
          toggleOpen={() => toggleSection('quadro')} 
        />
        <LegislacaoSection 
          isOpen={openSections.legislacao} 
          toggleOpen={() => toggleSection('legislacao')} 
        />
      </div>
    </aside>
  );
}

export default Sidebar;
