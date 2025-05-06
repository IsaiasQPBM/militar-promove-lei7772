
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Sidebar,
  SidebarProvider,
  SidebarContent
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  FileText,
  Clock,
  Award,
  TrendingUp,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SidebarMenu() {
  const { signOut } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <div className="flex h-full flex-col bg-indigo-700 text-white">
          <div className="flex h-14 items-center border-b px-4 bg-red-500">
            <NavLink to="/" className="flex items-center gap-2 font-semibold">
              <img src="/cbmepi-logo.svg" alt="CBMEPI Logo" className="h-8 w-8" />
              <span className="text-lg">SysProm - CBMEPI</span>
            </NavLink>
          </div>
          <ScrollArea className="flex-1">
            {/* OFICIAIS */}
            <div className="bg-purple-900 text-center py-2 font-bold">
              OFICIAIS
            </div>
            <div className="space-y-1 p-2">
              <NavLink 
                to="/oficiais/estado-maior" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-cbmepi-yellow rounded-md">
                  <Star className="h-4 w-4 text-black" />
                </span>
                <span>QOEM - Estado-Maior</span>
              </NavLink>
              
              <NavLink 
                to="/oficiais/especialistas" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-cbmepi-yellow rounded-md">
                  <Star className="h-4 w-4 text-black" />
                </span>
                <span>QOE - Especialistas</span>
              </NavLink>
              
              <NavLink 
                to="/oficiais/reserva" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-cbmepi-yellow rounded-md">
                  <Star className="h-4 w-4 text-black" />
                </span>
                <span>QORR - Reserva Remunerada</span>
              </NavLink>

              <NavLink 
                to="/fixacao-vagas" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <FileText className="h-4 w-4 text-black" />
                </span>
                <span>QFV - Fixação de Vagas</span>
              </NavLink>
              
              <NavLink 
                to="/antiguidade" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <Clock className="h-4 w-4 text-black" />
                </span>
                <span>QAA - Antiguidade</span>
              </NavLink>
              
              <NavLink 
                to="/merecimento" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <TrendingUp className="h-4 w-4 text-black" />
                </span>
                <span>QFM - Merecimento</span>
              </NavLink>
            </div>
            
            {/* PRAÇAS */}
            <div className="bg-purple-900 text-center py-2 font-bold">
              PRAÇAS
            </div>
            <div className="space-y-1 p-2">
              <NavLink 
                to="/pracas/ativos" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-orange-500 rounded-md">
                  <Users className="h-4 w-4 text-black" />
                </span>
                <span>QPBM - ATIVOS</span>
              </NavLink>
              
              <NavLink 
                to="/pracas/reserva" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-orange-500 rounded-md">
                  <Users className="h-4 w-4 text-black" />
                </span>
                <span>QPRR - Reserva Remunerada</span>
              </NavLink>
              
              <NavLink 
                to="/fixacao-vagas" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <FileText className="h-4 w-4 text-black" />
                </span>
                <span>QFV - Fixação de Vagas</span>
              </NavLink>
              
              <NavLink 
                to="/antiguidade" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <Clock className="h-4 w-4 text-black" />
                </span>
                <span>QAA - Antiguidade</span>
              </NavLink>
              
              <NavLink 
                to="/merecimento" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <TrendingUp className="h-4 w-4 text-black" />
                </span>
                <span>QFM - Merecimento</span>
              </NavLink>
            </div>
            
            {/* LEGISLAÇÃO */}
            <div className="bg-purple-900 text-center py-2 font-bold">
              LEGISLAÇÃO
            </div>
            <div className="space-y-1 p-2">
              <NavLink 
                to="/legislacao" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <FileText className="h-4 w-4 text-black" />
                </span>
                <span>Lei 7.772 DE 04/04/2022</span>
              </NavLink>
            </div>
            
            {/* PROMOÇÕES */}
            <div className="bg-purple-900 text-center py-2 font-bold">
              PROMOÇÕES
            </div>
            <div className="space-y-1 p-2">
              <NavLink 
                to="/gestao-promocoes" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <Award className="h-4 w-4 text-black" />
                </span>
                <span>Gestão de Promoções</span>
              </NavLink>
              
              <NavLink 
                to="/historico-promocoes" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <Clock className="h-4 w-4 text-black" />
                </span>
                <span>Histórico Promoções</span>
              </NavLink>
            </div>
            
            {/* CADASTRO */}
            <div className="bg-purple-900 text-center py-2 font-bold">
              CADASTRO
            </div>
            <div className="space-y-1 p-2">
              <NavLink 
                to="/cadastro-militar" 
                className={({ isActive }) => `
                  flex items-center p-2 space-x-2 rounded-md
                  ${isActive ? 'bg-indigo-800 text-white font-medium' : 'hover:bg-indigo-800 text-white'}
                `}
              >
                <span className="p-1 bg-gray-200 rounded-md">
                  <Users className="h-4 w-4 text-black" />
                </span>
                <span>Cadastrar Militar</span>
              </NavLink>
            </div>

            <button 
              onClick={signOut}
              className="w-full flex items-center space-x-2 p-3 text-white hover:bg-indigo-800 mt-8"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair do Sistema</span>
            </button>
          </ScrollArea>
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
