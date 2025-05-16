'use client';

import PanelButtonAction from '@/components/common/button/panelButtonAction';
import {
  deleteProperty,
  deleteRoom,
  getAllProperty,
  getRoomById,
  getRoomByPropertyId,
} from '@/handlers/tenant-property';
// import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { IProperty, IRoom } from '@/interfaces/property.interface';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

export default function TenantPropertyRoomListModel(propertyId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize state from URL query params
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [limit, setLimit] = useState<number>(Number(searchParams.get('limit')) || 15);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [table, setTable] = useState({
    head: ['No.', 'Image', 'Name', 'Capacity', 'Size(m²)', 'Total Room', 'Action'],
    body: [],
  });

  // Update URL when filters change
  const updateUrlWithFilters = () => {
    let params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Custom setter functions that update URL
  const handleSetPage = (newPage: number) => {
    setPage(newPage);
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleSetSearch = (newSearch: string) => {
    setSearch(newSearch);
  };

  async function getRoomList() {
    setIsLoading(true);

    const body: any = [];

    try {
      const res = await getRoomByPropertyId(propertyId, search, page, limit);
      const data: IRoom[] = res.data;
      const total_data: number = res.total_data;

      if (data) {
        data.map((row, index) => {
          body.push([
            index + 1,
            <div className="w-48 h-28 rounded-md">
              <Image
                src={row.roomImages[0].path}
                alt={row.name}
                width={360}
                height={360}
                className="w-full h-full object-cover rounded-md"
              />
            </div>,
            <p className="font-semibold">{row.name}</p>,
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-500" />
              <span>{row.capacity}</span>
            </div>,
            row.size,
            row.total_room,
            <PanelButtonAction
              key={'button'}
              onDelete={async () => {
                await deleteRoomList(propertyId, String(row.id));
              }}
              onUpdate={() => {
                router.push(`/tenant/property/${propertyId}/room/${row.id}/edit`);
              }}
            />,
          ]);
        });

        setTotal(total_data);
        setTotalPage(Math.ceil(total_data / limit));
        setTable({
          ...table,
          body: body,
        });
      }
    } catch (error) {
      console.error("Error fetching room list:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteRoomList(propertyId: string, roomId: string) {
    try {
      setIsLoading(true);
      await deleteRoom(propertyId, roomId).then(() => {
        getRoomList();
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      setIsLoading(false);
    }
  }

  // Consolidated useEffect to handle all filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlWithFilters();
      getRoomList();
    }, 300);

    return () => clearTimeout(handler);
  }, [page, limit, search]);

  return {
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setSearch: handleSetSearch,
    search,
    table,
    router,
    page,
    limit,
    total,
    totalPage,
    isLoading,
  };
}
