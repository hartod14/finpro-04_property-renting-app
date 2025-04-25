'use client';

import { Input } from '@/components/ui/input';
import { Search, X, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchDate: Date | null;
  setSearchDate: (value: Date | null) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  searchDate,
  setSearchDate,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-[500px]">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order Number & Property"
          className="w-full py-2 px-4 rounded-lg bg-white text-black border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200 pl-10 pr-10"
        />
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
          <Search className="w-5 h-5" />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="relative w-64">
        <DatePicker
          selected={searchDate}
          onChange={(date: Date | null) => setSearchDate(date)}
          placeholderText="Search by Date"
          className="w-full py-2 px-4 rounded-lg bg-white text-black border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200 pl-10"
          dateFormat="yyyy-MM-dd"
          openToDate={searchDate || new Date()}
        />
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
          <Clock className="w-5 h-5" />
        </div>
        <button
          type="button"
          onClick={() => setSearchDate(null)}
          className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
