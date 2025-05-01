
import React from 'react';

interface LoaderComponentProps {
  message?: string;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cbmepi-purple"></div>
      <span className="mt-2 text-gray-600">{message}</span>
    </div>
  );
};

export default LoaderComponent;
