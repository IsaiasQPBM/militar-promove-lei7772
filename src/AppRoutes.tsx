
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><IndexPage /></MainLayout>} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route path="/quadro-fixacao-vagas" element={<MainLayout><QuadroFixacaoVagasPage /></MainLayout>} />

      <Route path="/fixacao-vagas" element={<MainLayout><FixacaoVagasPage /></MainLayout>} />

      <Route path="/cadastro-militar" element={<MainLayout><CadastroMilitarPage /></MainLayout>} />

      <Route path="/editar-militar/:id" element={<MainLayout><EditarMilitarPage /></MainLayout>} />

      <Route path="/merecimento" element={<MainLayout><MerecimentoPage /></MainLayout>} />

      <Route path="/antiguidade" element={<MainLayout><AntiguidadePage /></MainLayout>} />

      <Route path="/legislacao" element={<MainLayout><LegislacaoPage /></MainLayout>} />

      <Route path="/gestao-promocoes" element={<MainLayout><GestaoPromocoesPage /></MainLayout>} />

      <Route path="/historico-promocoes" element={<MainLayout><HistoricoPromocoesPage /></MainLayout>} />

      <Route path="/modelos-documentos" element={<MainLayout><ModeloDocumentosPage /></MainLayout>} />

      <Route path="/importar-militares" element={<MainLayout><ImportarMilitaresPage /></MainLayout>} />

      <Route path="/ficha-militar/:id" element={<MainLayout><FichaMilitarPage /></MainLayout>} />
      
      <Route path="/ficha-conceito/:id" element={<MainLayout><FichaConceitoPage /></MainLayout>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
