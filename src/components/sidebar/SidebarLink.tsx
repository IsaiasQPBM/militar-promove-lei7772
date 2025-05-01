
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const SidebarLink = ({ to, children, className }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
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
      {children}
    </Link>
  );
};

export default SidebarLink;
