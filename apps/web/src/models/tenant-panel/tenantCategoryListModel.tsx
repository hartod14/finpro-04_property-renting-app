'use client';

import PanelButtonAction from '@/components/common/button/panelButtonAction';
import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';

export default function TenantCategoryListModel() {
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
    head: ['No.', 'Name', 'Action'],
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

  async function getCategoryList() {
    setIsLoading(true);

    const body: any = [];

    try {
      const res = await getAllCategory(search, page, limit);
      const data: ICategory[] = res.data;
      const total_data: number = res.total_data;

      if (data) {
        data.map((row, index) => {
          body.push([
            index + 1,
            row.name,

            <PanelButtonAction
              key={'button'}
              onDelete={async () => {
                await deleteCategoryList(row.id);
              }}
              onUpdate={() => {
                router.push(`/tenant/category/edit/${row.id}`);
              }}
            />,
          ]);
        });

        // Batch state updates to reduce rendering cycles
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

  async function deleteCategoryList(id: number) {
    try {
      setIsLoading(true);
      await deleteCategory(id.toString()).then(() => {
        getCategoryList();
      });
    } catch (error) {
      setIsLoading(false);
    }
  }
  
  // Consolidated useEffect to handle all filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlWithFilters();
      getCategoryList();
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
