import React from 'react';
import { QuadroMilitar } from '@/types';

export interface QuadroPracasProps {
  quadro: string;
  titulo: string;
}

const QuadroPracas: React.FC<QuadroPracasProps> = ({ quadro, titulo }) => {
  return (
    <div>
      <h1>{titulo}</h1>
      <p>Quadro: {quadro}</p>
    </div>
  );
};

export default QuadroPracas;
