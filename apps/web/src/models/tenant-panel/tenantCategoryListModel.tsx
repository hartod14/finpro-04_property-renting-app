'use client';

import PanelButtonAction from '@/components/common/button/panelButtonAction';
import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { useRouter } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';

export default function TenantCategoryListModel() {
  // const loading = useContext(LoadingContext);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [limit, setLimit] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [table, setTable] = useState({
    head: ['No.', 'Name', 'Action'],
    body: [],
  });
  const router = useRouter();

  async function getCategoryList() {
    // loading?.setLoading(true);

    const body: any = [];

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

      setTotal(total_data);
      setTotalPage(Math.ceil(total_data / limit));
      setTable({
        ...table,
        body: body,
      });
      // loading?.setLoading(false);
    }
  }

  async function deleteCategoryList(id: number) {
    try {
      // loading?.setLoading(true);
      await deleteCategory(id.toString()).then(() => {
        getCategoryList();
      });
    } catch (error) {
    } finally {
      // loading?.setLoading(false);
    }
  }
  useEffect(() => {
    getCategoryList();
  }, [page, limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      getCategoryList();
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
