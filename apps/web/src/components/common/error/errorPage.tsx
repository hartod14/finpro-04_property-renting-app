import React from 'react';
import Navbar from '@/components/common/navbar/navbar';

interface ErrorPageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message, onRetry }) => {
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="lg:mx-24 py-6 px-4 bg-[#FDFDFE] pt-28 min-h-screen">
        <div className="flex justify-center items-center h-60">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold">{message}</p>
            {onRetry && (
              <button
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                onClick={onRetry}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage; 