interface BookingInputProps {
    label: string;
    id: string;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
  }
  
  const BookingInput: React.FC<BookingInputProps> = ({ label, id, value, onChange }) => (
    <div className="flex flex-col text-black">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        type="date"
        id={id}
        className="mt-1 p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
  
  export default BookingInput;
  