
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Views
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import NotFoundPage from './pages/NotFound';
import QuadroFixacaoVagasPage from './pages/QuadroFixacaoVagas';
import CadastroMilitarPage from './pages/CadastroMilitar';
import EditarMilitarPage from './pages/EditarMilitar';
import IndexPage from './pages/Index';
import ModeloDocumentosPage from './pages/ModeloDocumentos';
import MerecimentoPage from './pages/Merecimento';
import AntiguidadePage from './pages/Antiguidade';
import LegislacaoPage from './pages/Legislacao';
import GestaoPromocoesPage from './pages/GestaoPromocoes';
import FixacaoVagasPage from './pages/FixacaoVagas';
import HistoricoPromocoesPage from './pages/HistoricoPromocoes';
import ImportarMilitaresPage from './pages/ImportarMilitares';
import FichaMilitarPage from './pages/FichaMilitar';
import FichaConceitoPage from './pages/FichaConceito';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Use a function component pattern to render a page within the layout
function PageWithLayout({ Page }: { Page: React.ComponentType }) {
  // Render the provided Page component inside the MainLayout
  return (
    <MainLayout>
      <Page />
    </MainLayout>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageWithLayout Page={IndexPage} />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <PageWithLayout Page={DashboardPage} />
          </ProtectedRoute>
        } 
      />

      <Route path="/quadro-fixacao-vagas" element={<PageWithLayout Page={QuadroFixacaoVagasPage} />} />
      <Route path="/fixacao-vagas" element={<PageWithLayout Page={FixacaoVagasPage} />} />
      <Route path="/cadastro-militar" element={<PageWithLayout Page={CadastroMilitarPage} />} />
      <Route path="/editar-militar/:id" element={<PageWithLayout Page={EditarMilitarPage} />} />
      <Route path="/merecimento" element={<PageWithLayout Page={MerecimentoPage} />} />
      <Route path="/antiguidade" element={<PageWithLayout Page={AntiguidadePage} />} />
      <Route path="/legislacao" element={<PageWithLayout Page={LegislacaoPage} />} />
      <Route path="/gestao-promocoes" element={<PageWithLayout Page={GestaoPromocoesPage} />} />
      <Route path="/historico-promocoes" element={<PageWithLayout Page={HistoricoPromocoesPage} />} />
      <Route path="/modelos-documentos" element={<PageWithLayout Page={ModeloDocumentosPage} />} />
      <Route path="/importar-militares" element={<PageWithLayout Page={ImportarMilitaresPage} />} />
      <Route path="/ficha-militar/:id" element={<PageWithLayout Page={FichaMilitarPage} />} />
      <Route path="/ficha-conceito/:id" element={<PageWithLayout Page={FichaConceitoPage} />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
