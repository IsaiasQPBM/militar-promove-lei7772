
import { useEffect, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/sidebar';

const MainLayout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
