'use client';

import PanelButtonAction from '@/components/common/button/panelButtonAction';
import { deleteProperty, getAllProperty } from '@/handlers/tenant-property';
// import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { IProperty } from '@/interfaces/property.interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';

export default function TenantPropertyListModel() {
  // const loading = useContext(LoadingContext);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [limit, setLimit] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [table, setTable] = useState({
    head: ['No.', 'Image', 'Name', 'Category', 'City', 'Room type', 'Action'],
    body: [],
  });
  const router = useRouter();

  async function getPropertyList() {
    setIsLoading(true);

    const body: any = [];

    try {
      const res = await getAllProperty(search, page, limit);
      const data: IProperty[] = res.data;
      const total_data: number = res.total_data;

      if (data) {
        data.map((row, index) => {
          body.push([
            index + 1,
            <div className="w-48 h-28 rounded-md">
              <Image
                src={row.propertyImages[0].path}
                alt={row.name}
                width={360}
                height={360}
                className="w-full h-full object-cover rounded-md"
              />
            </div>,
            <p className="font-semibold">{row.name}</p>,
            row.category.name,
            row.city.name,
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {row.rooms?.map((room) => (
                <li className="" key={room.id}>
                  {room.name}
                </li>
              )) || 'No room type'}
            </ul>,
            <PanelButtonAction
              key={'button'}
              onListOrder={() => {
                router.push(`/tenant/orders`);
              }}
              onShowRoom={() => {
                router.push(`/tenant/property/${row.id}/room`);
              }}
              onDelete={async () => {
                await deletePropertyList(row.id);
              }}
              onUpdate={() => {
                router.push(`/tenant/property/edit/${row.id}`);
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
    } finally {
      setIsLoading(false);
    }
  }

  async function deletePropertyList(id: number) {
    try {
      setIsLoading(true);
      await deleteProperty(id.toString()).then(() => {
        getPropertyList();
      });
    } catch (error) {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getPropertyList();
  }, [page, limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
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
    isLoading,
  };
}
