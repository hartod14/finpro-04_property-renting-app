export const filterBookings = (
    bookings: any[],
    searchQuery: string,
    searchDate: Date | null
  ) => {
    return bookings.filter((booking) => {
      const isOrderNumberMatch = booking.booking.order_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isPropertyNameMatch = booking.property.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
  
      const isDateMatch = searchDate
        ? new Date(booking.booking.checkinDate).toLocaleDateString() ===
          searchDate.toLocaleDateString()
        : true;
  
      return (isOrderNumberMatch || isPropertyNameMatch) && isDateMatch;
    });
  };