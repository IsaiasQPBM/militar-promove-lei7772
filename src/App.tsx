// Existing imports
import './App.css';
import { lazy, Suspense, useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { createPhotoBucket } from './utils/createStorageBucket';
import { BrowserRouter } from 'react-router-dom';

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
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
