interface BookingSummaryProps {
  summary: any; // Adjust type as needed
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ summary }) => (
  <div className="space-y-8 col-span-1 lg:col-span-2">
    {/* Property Section */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
      <img
        src={summary?.property.image || 'https://via.placeholder.com/120'}
        alt="Property"
        className="rounded-xl w-full h-28 object-cover col-span-1"
      />
      <div className="col-span-2 space-y-1">
        <p className="text-gray-800 font-medium">{summary?.property.name}</p>
        <p className="text-gray-500 text-sm">{summary?.property.address}</p>
      </div>
    </section>

    {/* Room Section */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
      <img
        src={summary?.room.image || 'https://via.placeholder.com/120'}
        alt="Room"
        className="rounded-xl w-full h-28 object-cover col-span-1"
      />
      <div className="col-span-2 space-y-1">
        <p className="text-gray-800 font-medium">{summary?.room.name}</p>
        <p className="text-gray-500 text-sm">{summary?.room.capacity} person</p>
      </div>
    </section>

    {/* User Section */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
      <img
        src={summary?.user.image || 'https://via.placeholder.com/120'}
        alt="User"
        className="rounded-full w-24 h-24 object-cover mx-auto sm:mx-0"
      />
      <div className="col-span-2 space-y-1">
        <p className="text-gray-800 font-medium">{summary?.user.name}</p>
        <p className="text-gray-500 text-sm">{summary?.user.email}</p>
        <p className="text-gray-500 text-sm">{summary?.user.phone}</p>
      </div>
    </section>
  </div>
);

export default BookingSummary;
