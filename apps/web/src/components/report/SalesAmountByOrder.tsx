import { Bar } from 'react-chartjs-2';
import { formatRupiah } from '@/utils/report/formatRupiah';
import { generateBarChartData } from '@/utils/report/barChartData';

const SalesAmountByOrderChart = ({ salesReport }: { salesReport: any }) => {
  const barChartData = generateBarChartData(salesReport);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `Jumlah: ${formatRupiah(value)}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sales Amount by Order
      </h3>
      <div className="relative h-64">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default SalesAmountByOrderChart;