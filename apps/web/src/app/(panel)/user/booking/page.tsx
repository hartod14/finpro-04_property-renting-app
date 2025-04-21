'use client';

import { useSession } from 'next-auth/react';
import UserSidebar from '@/components/common/sidebar/userSidebar';

// Sample purchase data
const SAMPLE_PURCHASES = [
  {
    id: 1,
    date: 'Jan 15, 2023',
    property: 'Luxury Villa Bali',
    amount: '$1,200',
    status: 'Completed',
  },
  {
    id: 2,
    date: 'Feb 20, 2023',
    property: 'Urban Apartment Jakarta',
    amount: '$800',
    status: 'Completed',
  },
  {
    id: 3,
    date: 'Mar 5, 2023',
    property: 'Beach House Lombok',
    amount: '$950',
    status: 'Processing',
  },
  {
    id: 4,
    date: 'Apr 10, 2023',
    property: 'Mountain Cabin Bandung',
    amount: '$650',
    status: 'Completed',
  },
];

export default function PurchaseListPage() {
  const { data: session } = useSession();

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className="text-xl font-semibold mb-6">Purchase History</h2>

    </div>
  );
}
