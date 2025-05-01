
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  icon?: React.ReactNode;
  iconBg?: string;
  iconShape?: string;
}

const SidebarLink = ({ 
  to, 
  children, 
  className,
  active,
  icon,
  iconBg,
  iconShape
}: SidebarLinkProps) => {
  const location = useLocation();
  // If active prop isn't provided, determine it from the route
  const isActive = active !== undefined ? active : location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center p-2 pl-9 text-sm rounded-lg",
        isActive 
          ? "bg-gray-200 text-gray-900 font-medium" 
          : "text-gray-700 hover:bg-gray-100",
        className
      )}
    >
      {icon && (
        <span className={cn(
          "mr-2 flex items-center justify-center w-5 h-5 rounded-md",
          iconBg,
          iconShape === "triangle" ? "clip-path-triangle" : ""
        )}>
          {icon}
        </span>
      )}
      {children}
    </Link>
  );
};

export default SidebarLink;
