'use client';

import PanelButtonAction from '@/components/common/button/panelButtonAction';
import { deleteProperty, getAllProperty } from '@/handlers/tenant-property';
// import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { IProperty } from '@/interfaces/property.interface';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';

export default function TenantPropertyListModel() {
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
    head: ['No.', 'Image', 'Name', 'Category', 'City', 'Room type', 'Action'],
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

  // Consolidated useEffect to handle all filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlWithFilters();
      getPropertyList();
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
