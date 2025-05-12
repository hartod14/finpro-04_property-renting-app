export default function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={`text-sm pt-1 pb-2 px-2 rounded-full font-medium ${status == 'passed' ? 'bg-red-200 border border-red-600 text-red-600' : status == 'incoming' ? 'bg-blue-200 border border-blue-600 text-blue-600' : 'bg-green-200 border border-green-600 text-green-600'}`}
    >
      <p>{status} </p>
    </div>
  );
}
