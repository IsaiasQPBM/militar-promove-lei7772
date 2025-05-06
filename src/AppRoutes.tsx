
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
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

// Páginas para os quadros de oficiais
import QuadroOficiais from './pages/quadros/QuadroOficiais';

// Páginas para os quadros de praças
import QuadroPracas from './pages/quadros/QuadroPracas';

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
        
        {/* Adicionar rotas para Oficiais */}
        <Route path="oficiais">
          <Route path="estado-maior" element={<QuadroOficiais quadro="QOEM" titulo="Quadro de Oficiais do Estado-Maior" />} />
          <Route path="especialistas" element={<QuadroOficiais quadro="QOE" titulo="Quadro de Oficiais Especialistas" />} />
          <Route path="reserva" element={<QuadroOficiais quadro="QORR" titulo="Quadro de Oficiais da Reserva Remunerada" />} />
          <Route path="saude" element={<QuadroOficiais quadro="QOBM-S" titulo="Quadro de Oficiais de Saúde" />} />
          <Route path="engenheiros" element={<QuadroOficiais quadro="QOBM-E" titulo="Quadro de Oficiais Engenheiros" />} />
          <Route path="complementares" element={<QuadroOficiais quadro="QOBM-C" titulo="Quadro de Oficiais Complementares" />} />
        </Route>
        
        {/* Adicionar rotas para Praças */}
        <Route path="pracas">
          <Route path="ativos" element={<QuadroPracas quadro="QPBM" titulo="Quadro de Praças Bombeiros Militares" />} />
          <Route path="reserva" element={<QuadroPracas quadro="QPRR" titulo="Quadro de Praças da Reserva Remunerada" />} />
        </Route>
        
        {/* Adicionar rota para editar militar de outra forma */}
        <Route path="militar/:id/editar" element={<EditarMilitarPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
