import { format, isToday, isYesterday, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formatRelativeTime = (dateString: string) => {
  if (!dateString) return "";
  const date = parseISO(dateString);
  if (isToday(date)) {
    return format(date, "HH:mm");
  }
  if (isYesterday(date)) {
    return "Ayer";
  }
  return format(date, "d MMM", { locale: es });
};

export const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "";
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
};
