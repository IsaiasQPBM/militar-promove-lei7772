
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

// Create a wrapper component that renders the page within MainLayout
// This avoids passing children directly to MainLayout
const PageWithLayout = ({ Page }: { Page: React.ComponentType }) => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

// A component to render the specific page content
const PageContent = ({ Page }: { Page: React.ComponentType }) => <Page />;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="quadro-fixacao-vagas" element={<QuadroFixacaoVagasPage />} />
        <Route path="fixacao-vagas" element={<FixacaoVagasPage />} />
        <Route path="cadastro-militar" element={<CadastroMilitarPage />} />
        <Route path="editar-militar/:id" element={<EditarMilitarPage />} />
        <Route path="merecimento" element={<MerecimentoPage />} />
        <Route path="antiguidade" element={<AntiguidadePage />} />
        <Route path="legislacao" element={<LegislacaoPage />} />
        <Route path="gestao-promocoes" element={<GestaoPromocoesPage />} />
        <Route path="historico-promocoes" element={<HistoricoPromocoesPage />} />
        <Route path="modelos-documentos" element={<ModeloDocumentosPage />} />
        <Route path="importar-militares" element={<ImportarMilitaresPage />} />
        <Route path="ficha-militar/:id" element={<FichaMilitarPage />} />
        <Route path="ficha-conceito/:id" element={<FichaConceitoPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
