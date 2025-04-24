
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/NotFound";
import QuadroOficiais from "./pages/quadros/QuadroOficiais";
import QuadroPracas from "./pages/quadros/QuadroPracas";
import FixacaoVagas from "./pages/FixacaoVagas";
import Antiguidade from "./pages/Antiguidade";
import Merecimento from "./pages/Merecimento";
import Legislacao from "./pages/Legislacao";
import FichaMilitar from "./pages/FichaMilitar";
import CadastroMilitar from "./pages/CadastroMilitar";
import EditarMilitar from "./pages/EditarMilitar";
import HistoricoPromocoes from "./pages/HistoricoPromocoes";
import GestaoPromocoes from "./pages/GestaoPromocoes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="oficiais/estado-maior" element={<QuadroOficiais tipo="QOEM" />} />
        <Route path="oficiais/especialistas" element={<QuadroOficiais tipo="QOE" />} />
        <Route path="oficiais/reserva" element={<QuadroOficiais tipo="QORR" />} />
        <Route path="pracas/ativos" element={<QuadroPracas tipo="QPBM" />} />
        <Route path="pracas/reserva" element={<QuadroPracas tipo="QPRR" />} />
        <Route path="fixacao-vagas" element={<FixacaoVagas />} />
        <Route path="antiguidade" element={<Antiguidade />} />
        <Route path="merecimento" element={<Merecimento />} />
        <Route path="legislacao" element={<Legislacao />} />
        <Route path="militar/:id" element={<FichaMilitar />} />
        <Route path="militar/:id/editar" element={<EditarMilitar />} />
        <Route path="militar/:id/promocoes" element={<HistoricoPromocoes />} />
        <Route path="cadastro-militar" element={<CadastroMilitar />} />
        <Route path="gestao-promocoes" element={<GestaoPromocoes />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
