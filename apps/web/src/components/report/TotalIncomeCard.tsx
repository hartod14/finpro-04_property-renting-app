import { formatRupiah } from '@/utils/report/formatRupiah';

interface TotalIncomeCardProps {
  totalIncome: number;
}

const TotalIncomeCard: React.FC<TotalIncomeCardProps> = ({ totalIncome }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        Total Income
      </h2>
      <div className="text-2xl font-bold text-indigo-600">
        {formatRupiah(totalIncome)}
      </div>
    </div>
  );
};

export default TotalIncomeCard;