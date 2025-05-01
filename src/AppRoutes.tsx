
import { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/oficiais/estado-maior" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <QuadroOficiais quadro="QOEM" titulo="Quadro de Oficiais do Estado-Maior" />
        </ProtectedRoute>
      } />
      
      <Route path="/oficiais/especialistas" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <QuadroOficiais quadro="QOE" titulo="Quadro de Oficiais Especialistas" />
        </ProtectedRoute>
      } />
      
      <Route path="/oficiais/reserva" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <QuadroOficiais quadro="QORR" titulo="Quadro de Oficiais da Reserva Remunerada" />
        </ProtectedRoute>
      } />
      
      <Route path="/pracas/ativos" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <QuadroPracas quadro="QPBM" titulo="Quadro de Praças Bombeiros Militar" />
        </ProtectedRoute>
      } />
      
      <Route path="/pracas/reserva" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <QuadroPracas quadro="QPRR" titulo="Quadro de Praças da Reserva Remunerada" />
        </ProtectedRoute>
      } />
      
      <Route path="/cadastro/militar" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <CadastroMilitar />
        </ProtectedRoute>
      } />
      
      <Route path="/militar/:id/editar" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <EditarMilitar />
        </ProtectedRoute>
      } />
      
      <Route path="/militar/:id" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <FichaMilitar />
        </ProtectedRoute>
      } />
      
      <Route path="/militar/:id/promocoes" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <HistoricoPromocoes />
        </ProtectedRoute>
      } />
      
      <Route path="/importar/militares" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <ImportarMilitares />
        </ProtectedRoute>
      } />
      
      <Route path="/antiguidade" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <Antiguidade />
        </ProtectedRoute>
      } />
      
      <Route path="/merecimento" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <Merecimento />
        </ProtectedRoute>
      } />
      
      <Route path="/gestao/promocoes" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <GestaoPromocoes />
        </ProtectedRoute>
      } />
      
      <Route path="/legislacao" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <Legislacao />
        </ProtectedRoute>
      } />
      
      <Route path="/fixacao-vagas" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <FixacaoVagas />
        </ProtectedRoute>
      } />
      
      <Route path="/proximos-promocao" element={
        <ProtectedRoute isAuth={isAuthenticated}>
          <ProximosPromocao />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
