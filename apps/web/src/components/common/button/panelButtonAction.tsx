import {
  BedDouble,
  Clipboard,
  ClipboardList,
  Edit,
  Eye,
  Hotel,
  House,
  List,
  ListCollapse,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { FaEdit, FaEye, FaList, FaPencilAlt, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface ButtonActionProps {
  onShow?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
  onListOrder?: () => void;
  onShowRoom?: () => void;
}

export default function PanelButtonAction(props: ButtonActionProps) {
  const { onDelete, onShow, onUpdate, onListOrder, onShowRoom } = props;
  return (
    <div className="flex gap-2 items-center">
      {onShowRoom && (
        <div
          onClick={() => onShowRoom()}
          className="p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group"
        >
          <BedDouble
            width={24}
            height={24}
            className=" cursor-pointer text-green-700"
            onClick={onShowRoom}
          />
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            List Room
          </span>
        </div>
      )}

      {onShow && (
        <div
          onClick={() => onShow()}
          className="p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group"
        >
          <Eye
            width={24}
            height={24}
            className=" cursor-pointer"
            onClick={onShow}
          />
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Show
          </span>
        </div>
      )}
      {onUpdate && (
        <div
          onClick={() => onUpdate()}
          className="p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group"
        >
          <Edit width={24} height={24} className=" text-yellow-500" />
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Edit
          </span>
        </div>
      )}
      {onDelete && (
        <div
          className="p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group"
          onClick={() => {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it',
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  await onDelete();
                  Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                  });
                } catch {
                } finally {
                }
              }
            });
          }}
        >
          <Trash
            width={24}
            height={24}
            className="text-red-500 cursor-pointer"
          />
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Delete
          </span>
        </div>
      )}
    </div>
  );
}
