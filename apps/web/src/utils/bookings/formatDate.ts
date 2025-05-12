import { format } from 'date-fns';

export const formatDate = (date: string | null | undefined): string => {
  try {
    return date ? format(new Date(date), 'dd MMM yyyy') : 'Invalid';
  } catch {
    return 'Invalid';
  }
};
