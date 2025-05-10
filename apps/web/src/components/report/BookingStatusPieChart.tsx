import { Pie } from 'react-chartjs-2';

const BookingStatusPieChart = () => {
  const pieChartData = {
    labels: ['Booked', 'Available'],
    datasets: [
      {
        data: [10, 20],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Booking Status
      </h3>
      <div className="relative h-64">
        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default BookingStatusPieChart;