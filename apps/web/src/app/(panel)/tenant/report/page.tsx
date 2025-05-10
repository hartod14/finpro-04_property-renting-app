'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatRupiah } from '@/utils/report/formatRupiah';
import { generateBarChartData } from '@/utils/report/barChartData';
import TotalIncomeCard from '@/components/report/TotalIncomeCard';
import SalesAmountByOrder from '@/components/report/SalesAmountByOrder';
import SalesAmountByOrderChart from '@/components/report/SalesAmountByOrder';
import BookingStatusPieChart from '@/components/report/BookingStatusPieChart';
import SalesReportTable from '@/components/report/SalesReportTable';
import PropertyCalendar from '@/components/report/PropertyCalendar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface DateRange {
  start: string;
  end: string;
}

interface Room {
  roomId: string;
  roomName: string;
  unavailableDates: DateRange[];
  bookedDates: DateRange[];
}

interface Property {
  propertyId: string;
  propertyName: string;
  rooms: Room[];
}

export default function TenantReportAnalysisPage() {
  const { data: session } = useSession();
  const [salesReport, setSalesReport] = useState<any>(null);
  const [calendar, setCalendar] = useState<Property[] | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const tenantId = session?.user?.id;
  const accessToken = session?.user?.access_token;

  useEffect(() => {
    if (!tenantId || !accessToken) return;

    const fetchSalesReport = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/report/sales/${tenantId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setSalesReport(response.data.data);
      } catch (error) {
        console.error('Error fetching sales report:', error);
      }
    };

    const fetchPropertyCalendar = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/report/calendar/${tenantId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setCalendar(response.data.data);
      } catch (error) {
        console.error('Error fetching property calendar:', error);
      }
    };

    fetchSalesReport();
    fetchPropertyCalendar();
  }, [tenantId, accessToken]);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-3xl font-semibold text-center text-indigo-600">
        Tenant Report & Analysis
      </h1>

      {salesReport && <TotalIncomeCard totalIncome={salesReport.totalIncome} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {salesReport && <SalesAmountByOrderChart salesReport={salesReport} />}
        <BookingStatusPieChart />
      </div>

      {salesReport && <SalesReportTable salesReport={salesReport} />}

      {calendar && (
        <PropertyCalendar
          calendar={calendar}
          currentMonth={currentMonth}
          goToNextMonth={goToNextMonth}
          goToPreviousMonth={goToPreviousMonth}
        />
      )}
    </div>
  );
}
