'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { handlePageChange } from '@/utils/bookings/handlePageChange';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-center mt-6 items-center space-x-4">
      <button
        onClick={() => handlePageChange(currentPage - 1, totalPages, setCurrentPage)}
        disabled={currentPage === 1}
        className="flex items-center px-2 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber, totalPages, setCurrentPage)}
              className={`px-3 py-2 text-sm rounded-md ${
                pageNumber === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 hover:bg-blue-100'
              } transition-colors`}
            >
              {pageNumber}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1, totalPages, setCurrentPage)}
        disabled={currentPage === totalPages}
        className="flex items-center px-2 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
