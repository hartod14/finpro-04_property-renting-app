'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaList, FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons for actions
import { Edit, List, Trash } from 'lucide-react';
import Link from 'next/link'; // Import Link

export default function MyProperties() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!session?.user) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/tenant/${session.user.id}/properties`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          },
        );
        setProperties(res.data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, [session]);

  return (
    <div className="bg-gray-50 min-h-screen p-8 text-black">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">
          My Properties
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-lg font-semibold text-gray-600 text-center">
                <th className="px-4 py-3 border">No</th>
                <th className="px-4 py-3 border">Image</th>
                <th className="px-4 py-3 border">Property Name</th>
                <th className="px-4 py-3 border">Rooms Available</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map((property: any, index: number) => (
                  <tr
                    key={property.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 border text-center text-lg">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <img
                        src={
                          property.propertyImages?.[0]?.path ||
                          '/placeholder.jpg'
                        }
                        alt={property.name}
                        className="w-24 h-24 object-cover rounded-md mx-auto"
                      />
                    </td>

                    <td className="px-4 py-3 border text-lg">{property.name}</td>
                    <td className="px-4 py-3 border text-center">
                      {property.rooms.length}
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <div className="flex justify-center space-x-4">
                        <Link
                          href={`/tenant/property/list-booking/${property.id}`} // Arahkan ke halaman listBooking dengan id properti
                        >
                          <button className="text-blue-500 hover:text-blue-600 relative group">
                            <List
                              size={18}
                              className="transition-transform transform hover:scale-125"
                            />
                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                              List Orders
                            </span>
                          </button>
                        </Link>

                        <button className="text-yellow-500 hover:text-yellow-600 relative group">
                          <Edit
                            size={18}
                            className="transition-transform transform hover:scale-125"
                          />
                          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            Edit
                          </span>
                        </button>

                        <button className="text-red-500 hover:text-red-600 relative group">
                          <Trash
                            size={18}
                            className="transition-transform transform hover:scale-125"
                          />
                          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-400">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
