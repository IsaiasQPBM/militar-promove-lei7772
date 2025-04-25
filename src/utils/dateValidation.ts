
import { parse, isValid } from "date-fns";

export const isValidDateString = (dateString: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  return isValid(parsedDate);
};
