import Swal from 'sweetalert2';

export const handleCancelBooking = async (
  bookingId: number,
  accessToken: string,
  setBookings: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (!bookingId) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Booking ID is missing!',
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it',
    customClass: {
      confirmButton: 'bg-red-500 text-white hover:bg-red-600',
      cancelButton: 'bg-gray-300 text-black hover:bg-gray-400',
    },
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/bookings/${bookingId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Something went wrong');

    Swal.fire({
      icon: 'success',
      title: 'Cancelled!',
      text: 'Your booking has been cancelled.',
    });

    setBookings((prev) =>
      prev.map((item) =>
        item.booking.id === bookingId
          ? {
              ...item,
              booking: {
                ...item.booking,
                status: 'CANCELLED',
              },
            }
          : item
      )
    );
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: `Failed to cancel booking: ${error.message}`,
    });
  }
};
