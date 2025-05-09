export default function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={`text-white text-sm pt-1 pb-2 px-2  rounded-xl ${status === 'passed' ? 'bg-red-500' : status === 'incoming' ? 'bg-blue-500' : 'bg-green-500'}`}
    >
      <p>{status} </p>
    </div>
  );
}
