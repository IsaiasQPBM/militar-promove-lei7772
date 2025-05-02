// Existing imports
import './App.css';
import { lazy, Suspense, useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { createPhotoBucket } from './utils/createStorageBucket';

function App() {
  // Create photo storage bucket on app initialization
  useEffect(() => {
    createPhotoBucket();
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
