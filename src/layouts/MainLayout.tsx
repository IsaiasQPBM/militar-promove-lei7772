
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="bg-cbmepi-red text-white flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img src="/cbmepi-logo.svg" alt="CBMEPI Logo" className="h-8 w-8 md:h-12 md:w-12" />
          <h1 className={`font-bold ${isMobile ? "text-sm" : "text-xl"}`}>
            {isMobile ? "SysProm" : "SysProm - Sistema de Promoções do CBMEPI"}
          </h1>
        </div>
        <div className="flex items-center space-x-1 md:space-x-3">
          <div className="text-right mr-1 md:mr-2">
            <p className="text-xs md:text-sm font-bold truncate max-w-[100px] md:max-w-none">
              {userName}
            </p>
            <p className="text-[10px] md:text-xs">Perfil: admin</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-100 p-2 md:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
