
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/Sidebar";

const MainLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="bg-cbmepi-red text-white flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img src="/cbmepi-logo.svg" alt="CBMEPI Logo" className="h-12 w-12" />
          <h1 className="text-xl font-bold">SysProm - Sistema de Promoções do CBMEPI</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right mr-2">
            <p className="text-sm font-bold">Usuário: {user?.name}</p>
            <p className="text-xs">Perfil: admin</p>
          </div>
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
