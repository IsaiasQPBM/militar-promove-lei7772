
export interface QFVData {
  posto: string;
  vagasLei: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
}

export interface QFVDataByQuadro {
  [quadro: string]: QFVData[];
}
