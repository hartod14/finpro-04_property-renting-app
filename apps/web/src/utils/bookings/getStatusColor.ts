export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'WAITING_FOR_PAYMENT':
      return 'bg-yellow-100 text-yellow-800';
    case 'WAITING_FOR_CONFIRMATION':
      return 'bg-orange-100 text-orange-800';
    case 'EXPIRED':
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'DONE':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
