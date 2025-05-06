
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom colors for CBMEPI
export const cbmepiColors = {
  red: "#ff2c2c",        // Cabeçalho
  purple: "#6941c6",     // Destaque de botões e headers
  darkPurple: "#483285", // Hover em botões
  indigo: "#5046e4",     // Background do sidebar
  indigoDark: "#3f37c9", // Hover items do sidebar
  yellow: "#ffde59",     // Ícones oficiais
  orange: "#ff914d",     // Ícones praças
  white: "#ffffff"       // Texto
};
