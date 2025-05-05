
import { Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
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
import ImportarMilitares from "./pages/ImportarMilitares";
import Index from "./pages/Index";
import ModeloDocumentos from "./pages/ModeloDocumentos";
import ImportarMilitaresAI from "./pages/ImportarMilitaresAI";

// Define element property for ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Modify the ProtectedRoute usage in the router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    errorElement: <NotFound />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "oficiais/estado-maior",
        element: <QuadroOficiais tipo="QOEM" />
      },
      {
        path: "oficiais/especialistas",
        element: <QuadroOficiais tipo="QOE" />
      },
      {
        path: "oficiais/reserva",
        element: <QuadroOficiais tipo="QORR" />
      },
      {
        path: "pracas/ativos",
        element: <QuadroPracas tipo="QPBM" />
      },
      {
        path: "pracas/reserva",
        element: <QuadroPracas tipo="QPRR" />
      },
      {
        path: "fixacao-vagas",
        element: <FixacaoVagas />
      },
      {
        path: "antiguidade",
        element: <Antiguidade />
      },
      {
        path: "merecimento",
        element: <Merecimento />
      },
      {
        path: "legislacao",
        element: <Legislacao />
      },
      {
        path: "militar/:id",
        element: <FichaMilitar />
      },
      {
        path: "militar/:id/editar",
        element: <EditarMilitar />
      },
      {
        path: "militar/:id/promocoes",
        element: <HistoricoPromocoes />
      },
      {
        path: "cadastro-militar",
        element: <CadastroMilitar />
      },
      {
        path: "importar-militares",
        element: <ImportarMilitares />
      },
      {
        path: "gestao-promocoes",
        element: <GestaoPromocoes />
      },
      {
        path: "modelo-documentos",
        element: <ModeloDocumentos />
      },
      {
        path: "importar-militares-ai",
        element: <ImportarMilitaresAI />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
