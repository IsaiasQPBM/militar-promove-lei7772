
import React from "react";

interface LoaderProps {
  message?: string;
  className?: string;
}

const LoaderComponent: React.FC<LoaderProps> = ({ 
  message = "Carregando...", 
  className = "h-64" 
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple mr-3"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoaderComponent;
