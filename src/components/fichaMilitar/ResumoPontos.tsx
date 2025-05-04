
interface ResumoPontosProps {
  totalPontos: number;
}

export const ResumoPontos = ({ totalPontos }: ResumoPontosProps) => {
  return (
    <div className="p-4 flex justify-between items-center bg-gray-100">
      <span className="font-bold text-xl">Total de Pontos:</span>
      <span className="font-bold text-xl">{totalPontos.toFixed(2)}</span>
    </div>
  );
};
