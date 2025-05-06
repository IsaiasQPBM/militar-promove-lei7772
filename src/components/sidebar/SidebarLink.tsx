
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  children: ReactNode;
  icon: ReactNode;
  to: string;
}

export const SidebarLink = ({ children, icon, to }: SidebarLinkProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center p-2 space-x-2 rounded-md
        ${isActive ? 'bg-cbmepi-purple text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}
      `}
    >
      <span className="p-1">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
};
