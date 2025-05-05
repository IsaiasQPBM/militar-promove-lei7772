
import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <IndexPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <React.Suspense fallback={<div>Carregando...</div>}>
              <DashboardPage />
            </React.Suspense>
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/quadro-fixacao-vagas" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <QuadroFixacaoVagasPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/fixacao-vagas" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <FixacaoVagasPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/cadastro-militar" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <CadastroMilitarPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/editar-militar/:id" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <EditarMilitarPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/merecimento" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <MerecimentoPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/antiguidade" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <AntiguidadePage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/legislacao" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <LegislacaoPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/gestao-promocoes" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <GestaoPromocoesPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/historico-promocoes" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <HistoricoPromocoesPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/modelos-documentos" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <ModeloDocumentosPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/importar-militares" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <ImportarMilitaresPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="/ficha-militar/:id" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <FichaMilitarPage />
          </React.Suspense>
        </MainLayout>
      } />
      
      <Route path="/ficha-conceito/:id" element={
        <MainLayout>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <FichaConceitoPage />
          </React.Suspense>
        </MainLayout>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
