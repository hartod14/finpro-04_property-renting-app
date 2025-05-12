'use client';

import StatusBadge from '@/components/common/badge/statusBadge';
import PanelButtonAction from '@/components/common/button/panelButtonAction';
import {
  deleteProperty,
  deleteRoom,
  getAllProperty,
  getRoomById,
  getRoomByPropertyId,
} from '@/handlers/tenant-property';
import {
  deleteRoomAvailabilityData,
  getAllRoomAvailability,
} from '@/handlers/tenant-room-availability';
// import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { IProperty, IRoom } from '@/interfaces/property.interface';
import { IRoomAvailability } from '@/interfaces/room-availability.interface';
import { formatDateOnly, formatTimeOnly } from '@/utils/formatters';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

export default function TenantRoomAvailabilityListModel() {
  // const loading = useContext(LoadingContext);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [limit, setLimit] = useState<number>(15);
  const [date, setDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [table, setTable] = useState({
    head: ['No.', 'Unavailable Date', 'Room', 'Status', 'Note', 'Action'],
    body: [],
  });
  const router = useRouter();

  async function getRoomList() {
    // loading?.setLoading(true);

    const body: any = [];

    const res = await getAllRoomAvailability(search, page, limit, date, status);

    const data: IRoomAvailability[] = res.data;

    const total_data: number = res.total_data;

    if (data) {
      data.map((row, index) => {
        body.push([
          index + 1,
          <p className="font-bold text-primary">
            {`${formatDateOnly(row.start_date)} - ${formatDateOnly(row.end_date)}`}
          </p>,
          <div>
            {(() => {
              const roomsByProperty = row.roomHasUnavailableDates.reduce(
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
                  {Object.keys(roomsByProperty).length === 0 && 'No rooms'}
                </div>
              );
            })()}
          </div>,
          <div className="flex">
            <StatusBadge status={row.status} />
          </div>,
          row.description,
          <PanelButtonAction
            key={'button'}
            onDelete={async () => {
              await deleteRoomAvailability(String(row.id));
            }}
            onUpdate={() => {
              router.push(`/tenant/room-availability/edit/${row.id}`);
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

  async function deleteRoomAvailability(id: string) {
    try {
      // loading?.setLoading(true);
      await deleteRoomAvailabilityData(id).then(() => {
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      getRoomList();
    }, 300);

    return () => clearTimeout(handler);
  }, [date, status]);

  return {
    setPage,
    setLimit,
    setSearch,
    setDate,
    setStatus,
    search,
    date,
    status,
    table,
    router,
    page,
    limit,
    total,
    totalPage,
  };
}
