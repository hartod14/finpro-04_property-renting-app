import { format } from 'date-fns';
import { formatRupiah } from '@/utils/report/formatRupiah';

interface SalesReportTableProps {
  salesReport: any;
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({ salesReport }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Sales Report</h2>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="p-3 text-left">Order Number</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Property</th>
            <th className="p-3 text-left">Room</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {salesReport.bookings.map((booking: any) => (
            <tr key={booking.bookingId} className="border-t hover:bg-gray-50">
              <td className="p-3">{booking.orderNumber}</td>
              <td className="p-3">{booking.user}</td>
              <td className="p-3">{booking.property}</td>
              <td className="p-3">{booking.room}</td>
              <td className="p-3">{formatRupiah(booking.amount)}</td>
              <td className="p-3">
                {format(new Date(booking.paymentDate), 'dd MMM yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReportTable;