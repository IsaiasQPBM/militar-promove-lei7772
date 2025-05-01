import React from 'react';
import { QuadroMilitar } from '@/types';

export interface QuadroOficiaisProps {
  quadro: string;
  titulo: string;
}

const QuadroOficiais: React.FC<QuadroOficiaisProps> = ({ quadro, titulo }) => {
  return (
    <div>
      <h1>{titulo}</h1>
      <p>Quadro: {quadro}</p>
    </div>
  );
};

export default QuadroOficiais;
