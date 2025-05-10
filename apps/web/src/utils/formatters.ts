export const formatTimeOnly = (
  timeString: string | null | undefined,
): string | undefined => {
  if (!timeString) return undefined;

  try {
    if (
      typeof timeString === 'string' &&
      /^\d{2}:\d{2}(:\d{2})?$/.test(timeString)
    ) {
      return timeString.substring(0, 5);
    }

    const timeMatch = timeString.match(/(\d{2}):(\d{2}):\d{2}/);
    if (timeMatch) {
      return `${timeMatch[1]}:${timeMatch[2]}`;
    }

    if (timeString.includes('T') && timeString.includes('Z')) {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return undefined;
    }

    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (error) {
    return undefined;
  }
};

export const formatDateOnly = (
  dateString: string | null | undefined,
): string | undefined => {
  if (!dateString) return undefined;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount);
};

