'use client';

import { FaSearch, FaPlus } from 'react-icons/fa'; // Importing icons for actions
import Link from 'next/link'; // Import Link
import TenantPropertyListModel from '@/models/tenant-panel/tenantPropertyListModel';
import { PanelPagination } from '@/components/common/pagination/panelPagination';
import Button from '@/components/common/button/button';
import Table from '@/components/common/table/table';
import { TenantSkeleton } from '@/components/common/tenant/tenantSkeleton';
export default function TenantPropertyListPage() {
  const {
    router,
    table,
    page,
    limit,
    total,
    totalPage,
    search,
    setSearch,
    setLimit,
    setPage,
    isLoading,
  } = TenantPropertyListModel();

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex justify-between">
        <div className="flex bg-white border border-gray-200 rounded-md w-1/4 px-3 py-2">
          <div className="flex justify-center items-center mr-3">
            <FaSearch width={20} height={20} />
          </div>

          <input
            type="text"
            value={search}
            placeholder="Search"
            className=" w-full focus:outline-none"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/property/create">
            <Button
              color="primaryOrange"
              textColor="white"
              iconPosition="before"
              name="Add Property"
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
              No property found
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
