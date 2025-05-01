
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SidebarLinkProps {
  to: string;
  active: boolean;
  children: ReactNode;
  icon: ReactNode;
  iconBg?: string;
  iconShape?: "circle" | "triangle";
}

export const SidebarLink = ({ 
  to, 
  active, 
  children, 
  icon, 
  iconBg, 
  iconShape = "circle" 
}: SidebarLinkProps) => {
  const renderIcon = () => {
    if (!iconBg) {
      return <div className="w-5">{icon}</div>;
    }
    
    if (iconShape === "triangle") {
      return (
        <div 
          className={cn("flex items-center justify-center", iconBg)} 
          style={{ 
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", 
            width: "20px", 
            height: "20px" 
          }}
        >
          {icon}
        </div>
      );
    }
    
    return (
      <div className={cn("rounded-full p-0.5 flex items-center justify-center", iconBg)}>
        {icon}
      </div>
    );
  };
  
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
        active ? "bg-cbmepi-darkPurple" : "hover:bg-cbmepi-lightPurple"
      )}
    >
      {renderIcon()}
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};
