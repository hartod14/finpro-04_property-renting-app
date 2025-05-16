'use client';

import StatusBadge from '@/components/common/badge/statusBadge';
import PanelButtonAction from '@/components/common/button/panelButtonAction';
import {
  deleteSeasonRateData,
  getAllSeasonRates,
} from '@/handlers/tenant-season-rate';
import { ISeasonRate } from '@/interfaces/season-rate.interface';
import { formatCurrency, formatDateOnly } from '@/utils/formatters';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaArrowDown,
} from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';

export default function TenantSeasonRateListModel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize state from URL query params
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [limit, setLimit] = useState<number>(Number(searchParams.get('limit')) || 15);
  const [date, setDate] = useState<string>(searchParams.get('date') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || '');
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [table, setTable] = useState({
    head: [
      'No.',
      'Season Period',
      'Rate',
      'Type',
      'Room',
      'Status',
      // 'Note',
      'Action',
    ],
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
    if (date) {
      params.set('date', date);
    } else {
      params.delete('date');
    }
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
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

  const handleSetDate = (newDate: string) => {
    setDate(newDate);
  };

  const handleSetStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  async function getSeasonRateList() {
    setIsLoading(true);
    const body: any = [];

    try {
      const res = await getAllSeasonRates(search, page, limit, date, status);
      const data: ISeasonRate[] = res.data;
      const total_data: number = res.total_data;

      if (data) {
        data.map((row, index) => {
          body.push([
            index + 1,
            <p className="font-bold text-primary">
              {`${formatDateOnly(row.start_date)} - ${formatDateOnly(row.end_date)}`}
            </p>,
            <div>
              {row.value_type == 'PERCENTAGE'
                ? `${row.value}%`
                : `IDR ${formatCurrency(row.value)}`}
            </div>,
            <div className={`font-medium `}>
              {row.type == 'INCREASE' ? (
                <div className="text-green-600 flex items-center gap-2">
                  <span>
                    <FaArrowAltCircleUp width={24} height={24} />
                  </span>{' '}
                  Price Increase
                </div>
              ) : (
                <div className="text-red-500 flex items-center gap-2">
                  <span>
                    <FaArrowAltCircleDown width={24} height={24} />
                  </span>{' '}
                  Price Decrease
                </div>
              )}
            </div>,
            <div>
              {(() => {
                const roomsByProperty = row.roomHasPeakSeasonRates.reduce(
                  (acc: any, item: any) => {
                    const propertyId = item.room.property.id;
                    const propertyName = item.room.property.name;

                    if (!acc[propertyId]) {
                      acc[propertyId] = {
                        name: propertyName,
                        city: item.room.property.city,
                        rooms: [],
                      };
                    }

                    acc[propertyId].rooms.push(item.room);
                    return acc;
                  },
                  {},
                );

                return (
                  <div>
                    {Object.values(roomsByProperty).map((property: any) => (
                      <div key={property.name} className="mb-2">
                        <div className="font-semibold text-primary2">
                          {property.name}{' '}
                          <span className="text-gray-500 font-normal">
                            - {property.city.name}
                          </span>
                        </div>
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          {property.rooms.map((room: any) => (
                            <li key={room.id}>{room.name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {Object.keys(roomsByProperty).length == 0 && 'No rooms'}
                  </div>
                );
              })()}
            </div>,
            <div className="flex">
              <StatusBadge status={row.status} />
            </div>,
            // row.description,
            <PanelButtonAction
              key={'button'}
              onDelete={async () => {
                await deleteSeasonRate(String(row.id));
              }}
              onUpdate={() => {
                router.push(`/tenant/season-rate/edit/${row.id}`);
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
      console.error("Error fetching season rates:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSeasonRate(id: string) {
    try {
      setIsLoading(true);
      await deleteSeasonRateData(id).then(() => {
        getSeasonRateList();
      });
    } catch (error) {
      console.error("Error deleting season rate:", error);
      setIsLoading(false);
    }
  }

  // Consolidated useEffect to handle all filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlWithFilters();
      getSeasonRateList();
    }, 300);

    return () => clearTimeout(handler);
  }, [page, limit, search, date, status]);

  return {
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setSearch: handleSetSearch,
    setDate: handleSetDate,
    setStatus: handleSetStatus,
    search,
    date,
    status,
    table,
    router,
    page,
    limit,
    total,
    totalPage,
    isLoading,
  };
}
