'use client';

import Table from '@/components/common/table/table';
import TenantCategoryListModel from '@/models/tenant-panel/tenantCategoryListModel';
import Button from '@/components/common/button/button';
import { PanelPagination } from '@/components/common/pagination/panelPagination';
import { FaArrowRight, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { TenantSkeleton } from '@/components/common/tenant/tenantSkeleton';
import { SetStateAction, Dispatch } from 'react';

export default function TenantCategoryListPage() {
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
  } = TenantCategoryListModel();

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
          <Link href="/tenant/category/create">
            <Button
              color="primaryOrange"
              textColor="white"
              iconPosition="before"
              name="Add Category"
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
              No categories found
            </p>
          </div>
        ) : (
          <Table body={table.body} head={table.head} />
        )}
      </div>
      <PanelPagination
        limit={limit}
        page={page}
        setPage={setPage as Dispatch<SetStateAction<number>>}
        setLimit={setLimit as Dispatch<SetStateAction<number>>}
        total={total}
        totalPage={totalPage}
        totalPerPage={table.body.length}
      />
    </div>
  );
}
