
import React from "react";

interface LoaderProps {
  message?: string;
}

const LoaderComponent: React.FC<LoaderProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple mr-3"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoaderComponent;
