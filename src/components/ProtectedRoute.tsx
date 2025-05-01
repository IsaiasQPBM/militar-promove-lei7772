
import React from 'react';
import { Navigate } from 'react-router-dom';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuth: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuth }) => {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
