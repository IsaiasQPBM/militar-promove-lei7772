
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartProps {
  data: any;
  options?: any;
}

const defaultBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const defaultPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        boxWidth: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
    },
  },
};

const defaultLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const BarChart: React.FC<ChartProps> = ({ data, options = {} }) => {
  return <Bar data={data} options={{ ...defaultBarOptions, ...options }} />;
};

export const PieChart: React.FC<ChartProps> = ({ data, options = {} }) => {
  return <Pie data={data} options={{ ...defaultPieOptions, ...options }} />;
};

export const LineChart: React.FC<ChartProps> = ({ data, options = {} }) => {
  return <Line data={data} options={{ ...defaultLineOptions, ...options }} />;
};
