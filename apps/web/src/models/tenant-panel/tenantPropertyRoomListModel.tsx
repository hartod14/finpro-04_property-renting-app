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
import { useRouter } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

export default function TenantPropertyRoomListModel(propertyId: string) {
  // const loading = useContext(LoadingContext);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [limit, setLimit] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [table, setTable] = useState({
    head: ['No.', 'Image', 'Name', 'Capacity', 'Size(m²)', 'Total Room', 'Action'],
    body: [],
  });
  const router = useRouter();

  async function getRoomList() {
    // loading?.setLoading(true);

    const body: any = [];

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
              await deleteRoomList(row.id);
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
      // loading?.setLoading(false);
    }
  }

  async function deleteRoomList(id: number) {
    try {
      // loading?.setLoading(true);
      await deleteRoom(id.toString()).then(() => {
        getRoomList();
      });
    } catch (error) {
    } finally {
      // loading?.setLoading(false);
    }
  }
  useEffect(() => {
    getRoomList();
  }, [page, limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      getRoomList();
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);
  return {
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
  };
}
