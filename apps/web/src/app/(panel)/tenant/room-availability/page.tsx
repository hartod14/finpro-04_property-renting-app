'use client';

import Button from '@/components/common/button/button';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { PanelPagination } from '@/components/common/pagination/panelPagination';
import TenantRoomAvailabilityListModel from '@/models/tenant-panel/tenantRoomAvailabilityListModel';
import Table from '@/components/common/table/table';
import Link from 'next/link';
import { TenantSkeleton } from '@/components/common/tenant/tenantSkeleton';

export default function TenantRoomAvailabilityPage() {
  const {
    router,
    table,
    page,
    limit,
    total,
    totalPage,
    search,
    date,
    status,
    setSearch,
    setDate,
    setStatus,
    setLimit,
    setPage,
    isLoading,
  } = TenantRoomAvailabilityListModel();

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex justify-between gap-2">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-3/4">
          <div className="flex bg-white border border-gray-200 rounded-md w-full md:w-1/3 px-3 py-2">
            <div className="flex justify-center items-center mr-3">
              <FaSearch width={20} height={20} />
            </div>

            <input
              type="text"
              value={search}
              placeholder="Search Room or Property"
              className="w-full focus:outline-none"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-md w-full md:w-1/3 px-3 py-2">
            <input
              type="date"
              value={date}
              className="w-full focus:outline-none"
              name="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-md w-full md:w-1/3 px-3 py-2">
            <select
              value={status}
              className="w-full focus:outline-none"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="passed">Passed</option>
              <option value="incoming">Incoming</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/tenant/room-availability/create">
            <Button
              color="primaryOrange"
              textColor="white"
              iconPosition="before"
              name="Add Unavailable Date"
              icon={<FaPlus />}
            />
          </Link>
        </div>
      </div>
      <div className="relative h-[calc(100vh-250px)] overflow-auto">
        {isLoading ? (
          <TenantSkeleton />
        ) : table.body.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center bg-white border border-gray-200 rounded">
            <p className="text-xl font-semibold text-gray-500 mb-2">
              No room availability found
            </p>
          </div>
        ) : (
          <Table body={table.body} head={table.head} />
        )}
      </div>
      <PanelPagination
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        total={total}
        totalPage={totalPage}
        totalPerPage={table.body.length}
      />
    </div>
  );
}
