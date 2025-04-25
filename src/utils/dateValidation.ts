
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

// Function to normalize and format date input
export const normalizeDateInput = (input: string) => {
  // Remove non-digit characters
  let digits = input.replace(/\D/g, '');
  
  // Limit to 8 digits (DDMMYYYY)
  digits = digits.substring(0, 8);
  
  // Format as DD/MM/YYYY
  let formatted = "";
  if (digits.length > 0) {
    formatted = digits.substring(0, Math.min(2, digits.length));
    if (digits.length > 2) {
      formatted += '/' + digits.substring(2, Math.min(4, digits.length));
      if (digits.length > 4) {
        formatted += '/' + digits.substring(4, 8);
      }
    }
  }
  
  return formatted;
};

// Parse date string to Date object
export const parseDateString = (dateString: string): Date | null => {
  if (!isValidDateString(dateString)) return null;
  
  return parse(dateString, "dd/MM/yyyy", new Date());
};

