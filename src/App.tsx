
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Sidebar from "./components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-8 bg-gray-50">
            <AppRoutes />
          </div>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
