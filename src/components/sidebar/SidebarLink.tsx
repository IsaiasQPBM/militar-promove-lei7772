
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  children: ReactNode;
  icon: ReactNode;
  to: string;
  active?: boolean;
  iconBg?: string;
  iconShape?: string;
}

export const SidebarLink = ({ 
  children, 
  icon, 
  to, 
  active, 
  iconBg = "bg-gray-200",
  iconShape = "rounded-md"
}: SidebarLinkProps) => {
  // Use active prop if provided, otherwise use NavLink's isActive
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center p-2 space-x-2 ${iconShape}
        ${active || isActive ? 'bg-cbmepi-purple text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}
      `}
    >
      <span className={`p-1 ${iconBg} ${iconShape}`}>{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
};
