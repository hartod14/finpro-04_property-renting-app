'use client';

import { FaSearch, FaPlus } from 'react-icons/fa'; // Importing icons for actions
import Link from 'next/link'; // Import Link
import TenantPropertyListModel from '@/models/tenant-panel/tenantPropertyListModel';
import { PanelPagination } from '@/components/common/pagination/panelPagination';
import Button from '@/components/common/button/button';
import Table from '@/components/common/table/table';
import TenantPropertyListModelOrders from '@/models/tenant-panel/tenantPropertyListModelOrders';
export default function TenantPropertyListOrderPage() {
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
  } = TenantPropertyListModelOrders();

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex justify-between">
        <div className="flex bg-white border border-gray-200 rounded-md w-1/4 px-3 py-2">
          <div className="flex justify-center items-center mr-3 bg-white text-black">
            <FaSearch width={20} height={20} />
          </div>

          <input
            type="text"
            value={search}
            placeholder="Search"
            className=" w-full focus:outline-none bg-white text-black"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="relative h-[calc(100vh-250px)] overflow-auto text-black">
        <Table body={table.body} head={table.head} />
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
