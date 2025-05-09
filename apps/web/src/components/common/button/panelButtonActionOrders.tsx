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
  MessageCircle,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { FaEdit, FaEye, FaList, FaPencilAlt, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface ButtonActionPropsOrders {
  onShow?: () => void;
  onListOrder?: () => void;
  onShowReview?: () => void;
}

export default function PanelButtonActionOrders(
  props: ButtonActionPropsOrders,
) {
  const { onListOrder, onShowReview } = props;
  return (
    <div className="flex gap-2 items-center">
      {onListOrder && (
        <div
          onClick={() => onListOrder()}
          className="p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group"
        >
          <ClipboardList
            width={24}
            height={24}
            className=" cursor-pointer text-primary"
            onClick={onListOrder}
          />
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            List Order
          </span>
        </div>
      )}

      {onShowReview && (
        <div
          onClick={() => onShowReview()}
          className="p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group"
        >
          <MessageCircle
            width={24}
            height={24}
            className=" cursor-pointer text-purple-700"
            onClick={onShowReview}
          />
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            List Reviews
          </span>
        </div>
      )}
    </div>
  );
}
