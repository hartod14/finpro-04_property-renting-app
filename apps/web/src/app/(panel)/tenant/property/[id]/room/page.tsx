'use client';

import Button from '@/components/common/button/button';
import { PanelPagination } from '@/components/common/pagination/panelPagination';
import TenantPropertyRoomListModel from '@/models/tenant-panel/tenantPropertyRoomListModel';
import { use } from 'react';
import { FaArrowLeft, FaPlus, FaSearch } from 'react-icons/fa';
import Table from '@/components/common/table/table';
import Link from 'next/link';
import { TenantSkeleton } from '@/components/common/tenant/tenantSkeleton';
import { SetStateAction, Dispatch } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function TenantPropertyRoomPage({ params }: Props) {
  const resolvedParams = use(params);
  const {
    setPage,
    setLimit,
    setSearch,
    search,
    table,
    router,
    page,
    limit,
    total,
    totalPage,
    isLoading,
  } = TenantPropertyRoomListModel(resolvedParams.id);

  return (
    <div className="flex flex-col gap-4 pb-2 ">
      <Link
        href={`/tenant/property`}
        className="flex items-center hover:text-blue-400 gap-2 text-blue-500 w-fit"
      >
        <FaArrowLeft />
        <span className="text-sm ">Back to property</span>
      </Link>
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
          <Link href={`/tenant/property/${resolvedParams.id}/room/create`}>
            <Button
              color="primaryOrange"
              textColor="white"
              iconPosition="before"
              name="Add Room"
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
              No rooms found
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
