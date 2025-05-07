
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import QuadroFixacaoVagas from "@/pages/QuadroFixacaoVagas";
import GestaoPromocoesPage from "@/pages/GestaoPromocoes";
import ImportarMilitaresAI from "@/pages/ImportarMilitaresAI";
import Dashboard from "@/pages/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/register" element={<div>Register Page</div>} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Militares Routes */}
      <Route
        path="/militares"
        element={
          <ProtectedRoute>
            <div>Lista de Militares</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/militares/:id"
        element={
          <ProtectedRoute>
            <div>Detalhes do Militar</div>
          </ProtectedRoute>
        }
      />
      
      {/* Quadros Routes */}
      <Route
        path="/quadros/oficiais"
        element={
          <ProtectedRoute>
            <div>Quadro de Oficiais</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quadros/pracas"
        element={
          <ProtectedRoute>
            <div>Quadro de Praças</div>
          </ProtectedRoute>
        }
      />
      
      {/* QFV Route */}
      <Route
        path="/qfv"
        element={
          <ProtectedRoute>
            <QuadroFixacaoVagas />
          </ProtectedRoute>
        }
      />
      
      {/* Promoção Route */}
      <Route
        path="/gestao-promocoes"
        element={
          <ProtectedRoute>
            <GestaoPromocoesPage />
          </ProtectedRoute>
        }
      />
      
      {/* Importação AI */}
      <Route
        path="/importacao-ai"
        element={
          <ProtectedRoute>
            <ImportarMilitaresAI />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Not Found */}
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

export default AppRoutes;
