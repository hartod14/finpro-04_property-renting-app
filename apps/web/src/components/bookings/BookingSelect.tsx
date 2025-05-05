interface BookingSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

const BookingSelect: React.FC<BookingSelectProps> = ({ label, id, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-800">
      {label}
    </label>
    <select
      id={id}
      className="mt-1 p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Choose Payment Method</option>
      <option value="MANUAL">Manual Transfer</option>
      <option value="MIDTRANS">Payment Gateway</option>
    </select>
  </div>
);

export default BookingSelect;
