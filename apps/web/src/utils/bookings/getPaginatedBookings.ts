export const getPaginatedBookings = (
    filteredBookings: any[],
    currentPage: number,
    itemsPerPage: number
  ) => {
    return filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  };