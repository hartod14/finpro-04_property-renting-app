export const getTotalPages = (filteredBookings: any[], itemsPerPage: number) => {
    return Math.ceil(filteredBookings.length / itemsPerPage);
  };