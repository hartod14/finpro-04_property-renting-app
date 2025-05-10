import { format } from 'date-fns';

export const generateBarChartData = (salesReport: any) => {
  return {
    labels: salesReport
      ? salesReport.bookings.map((booking: any) =>
          format(new Date(booking.paymentDate), 'dd MMM yyyy')
        )
      : [],
    datasets: [
      {
        label: 'Jumlah (Rp)',
        data: salesReport
          ? salesReport.bookings.map((booking: any) => booking.amount)
          : [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
};