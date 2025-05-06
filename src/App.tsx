
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { createPhotoBucket } from './utils/createStorageBucket';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // Create photo storage bucket on app initialization
  useEffect(() => {
    try {
      createPhotoBucket();
    } catch (error) {
      console.error("Error creating photos bucket:", error);
      // Continue with the application even if bucket creation fails
    }
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
