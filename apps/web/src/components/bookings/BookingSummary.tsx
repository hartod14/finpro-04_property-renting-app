interface BookingSummaryProps {
  summary: any;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ summary }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 w-full border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">👤 User Information</h2>

    <div className="flex flex-col items-center space-y-6">
      <img
        src={summary?.user.image || 'https://via.placeholder.com/120'}
        alt="User"
        className="w-24 h-24 rounded-full object-cover ring-2 ring-primary shadow"
      />

      <div className="w-full space-y-4">
        {['name', 'email', 'phone'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 capitalize">{field}</label>
            <input
              type="text"
              value={summary?.user[field] || ''}
              disabled
              className="mt-1 w-full bg-gray-100 text-gray-600 border border-gray-300 rounded-xl px-4 py-3 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BookingSummary;
