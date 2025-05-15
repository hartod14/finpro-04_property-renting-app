import { FaSpinner } from "react-icons/fa";

export const TenantSkeleton = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-white border border-gray-200 rounded">
      <div className="flex flex-col items-center justify-center p-8">
        <FaSpinner className="text-primary animate-spin text-4xl mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
};
