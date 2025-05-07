
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  children?: ReactNode;
  icon: ReactNode;
  to?: string;
  href?: string;
  active?: boolean;
  iconBg?: string;
  iconShape?: string;
  label?: string;
}

export const SidebarLink = ({ 
  children, 
  icon, 
  to, 
  href,
  label,
  active, 
  iconBg = "bg-gray-200",
  iconShape = "rounded-md"
}: SidebarLinkProps) => {
  // Use the destination prop (either href or to)
  const destination = href || to || '/';
  const displayText = children || label;

  // Use active prop if provided, otherwise use NavLink's isActive
  return (
    <NavLink 
      to={destination} 
      className={({ isActive }) => `
        flex items-center p-2 space-x-2 ${iconShape}
        ${active || isActive ? 'bg-cbmepi-purple text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}
      `}
    >
      <span className={`p-1 ${iconBg} ${iconShape}`}>{icon}</span>
      <span>{displayText}</span>
    </NavLink>
  );
};

export default SidebarLink;
