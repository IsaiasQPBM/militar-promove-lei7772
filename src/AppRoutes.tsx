
import { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import Index from '@/pages/Index';
import Dashboard from "@/pages/Dashboard";
import Login from '@/pages/Login';
import Register from "@/pages/Register";
import NotFound from '@/pages/NotFound';
import QuadroOficiais from '@/pages/quadros/QuadroOficiais';
import QuadroPracas from '@/pages/quadros/QuadroPracas';
import CadastroMilitar from "@/pages/CadastroMilitar";
import EditarMilitar from "@/pages/EditarMilitar";
import FichaMilitar from '@/pages/FichaMilitar';
import ImportarMilitares from "@/pages/ImportarMilitares";
import Antiguidade from '@/pages/Antiguidade';
import Merecimento from '@/pages/Merecimento';
import GestaoPromocoes from '@/pages/GestaoPromocoes';
import HistoricoPromocoes from "@/pages/HistoricoPromocoes";
import Legislacao from "@/pages/Legislacao";
import FixacaoVagas from "@/pages/FixacaoVagas";
import ProximosPromocao from "@/pages/ProximosPromocao";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/oficiais/estado-maior" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <QuadroOficiais quadro="QOEM" titulo="Quadro de Oficiais do Estado-Maior" />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/oficiais/especialistas" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <QuadroOficiais quadro="QOE" titulo="Quadro de Oficiais Especialistas" />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/oficiais/reserva" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <QuadroOficiais quadro="QORR" titulo="Quadro de Oficiais da Reserva Remunerada" />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pracas/ativos" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <QuadroPracas quadro="QPBM" titulo="Quadro de Praças Bombeiros Militar" />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pracas/reserva" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <QuadroPracas quadro="QPRR" titulo="Quadro de Praças da Reserva Remunerada" />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/cadastro/militar" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <CadastroMilitar />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/militar/:id/editar" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <EditarMilitar />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/militar/:id" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <FichaMilitar />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/militar/:id/promocoes" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <HistoricoPromocoes />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/importar/militares" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <ImportarMilitares />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/antiguidade" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <Antiguidade />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/merecimento" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <Merecimento />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gestao/promocoes" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <GestaoPromocoes />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/legislacao" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <Legislacao />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/fixacao-vagas" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <FixacaoVagas />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/proximos-promocao" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <MainLayout>
            <ProximosPromocao />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
