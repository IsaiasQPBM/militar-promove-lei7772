
import { parse, isValid, format } from "date-fns";

export const isValidDateString = (dateString: string) => {
  if (!dateString || typeof dateString !== 'string') return false;
  
  // Check basic format with regex (DD/MM/YYYY)
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
  
  // Parse the date and check if it's valid
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  return isValid(parsedDate);
};

export const formatDateString = (dateString: string) => {
  if (!isValidDateString(dateString)) return "";
  
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  return format(parsedDate, "dd/MM/yyyy");
};

// Convert JS Date to formatted string
export const dateToFormattedString = (date: Date) => {
  if (!isValid(date)) return "";
  return format(date, "dd/MM/yyyy");
};
