import axios from 'axios';
import Swal from 'sweetalert2';

export const handleUploadPaymentProof = async (
  bookingId: number | null,
  paymentProof: File | null,
  accessToken: string,
  setIsModalOpen: (value: boolean) => void,
  setBookings: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (bookingId && paymentProof) {
    const formData = new FormData();
    formData.append('file', paymentProof);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/payments/${bookingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Payment Proof Uploaded!',
        text: 'Your payment proof has been uploaded successfully.',
      });

      setIsModalOpen(false);

      setBookings((prev) =>
        prev.map((item) =>
          item.booking.id === bookingId
            ? {
                ...item,
                booking: {
                  ...item.booking,
                  status: 'WAITING_FOR_CONFIRMATION',
                },
              }
            : item
        )
      );
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed!',
        text: `Failed to upload payment proof: ${error.message}`,
      });
    }
  }
};
