import { format, differenceInDays } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceipt = (booking: any) => {
  const doc = new jsPDF();

  const orderNumber = booking.booking.order_number;
  const formattedDate = format(new Date(), 'dd MMM yyyy');

  // Hitung durasi menginap dan total harga berdasarkan room.price
  const checkIn = new Date(booking.booking.checkinDate);
  const checkOut = new Date(booking.booking.checkoutDate);
  const duration = differenceInDays(checkOut, checkIn); // ex: 3 hari
  const pricePerNight = parseInt(booking.room.price);
  const totalPriceByDuration = pricePerNight * duration;

  // Format rupiah
  const formatRupiah = (num: number) =>
    `Rp ${num.toLocaleString('id-ID')}`;

  // HEADER
  const headerText = 'BOOKING RECEIPT';
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60);
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(headerText);
  const xPosition = (pageWidth - textWidth) / 2;
  doc.text(headerText, xPosition, 20);

  doc.setFontSize(12);
  doc.setTextColor(60);
  doc.text(`Order Number`, 14, 30);
  doc.text(`: ${orderNumber}`, 80, 30);
  doc.text(`Date`, 14, 36);
  doc.text(`: ${formattedDate}`, 80, 36);
  doc.setDrawColor(200);
  doc.line(14, 42, 196, 42);

  // Customer Info
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Customer Information', 14, 50);
  doc.setFontSize(12);
  doc.setTextColor(50);
  doc.text(`Name  : ${booking.user.name}`, 14, 58);
  doc.text(`Email : ${booking.user.email}`, 14, 64);
  doc.text(`Phone : 0${booking.user.phone}`, 14, 70);

  // Check-in Table
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Check-in Details', 14, 82);

  autoTable(doc, {
    startY: 88,
    head: [['Property', 'Room', 'Capacity', 'Check-in']],
    body: [
      [
        booking.property.name,
        booking.room.name,
        booking.room.capacity.toString(),
        format(checkIn, 'dd MMM yyyy'),
      ],
    ],
    theme: 'grid',
    styles: {
      halign: 'center',
      fontSize: 11,
      cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
      textColor: [40, 40, 40],
      lineWidth: 0.1,
      lineColor: [200, 200, 200],
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 12,
    },
    alternateRowStyles: {
      fillColor: [245, 250, 255],
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // Check-out Table
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Check-out Details', 14, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 16,
    head: [['Property', 'Room', 'Capacity', 'Check-out']],
    body: [
      [
        booking.property.name,
        booking.room.name,
        booking.room.capacity.toString(),
        format(checkOut, 'dd MMM yyyy'),
      ],
    ],
    theme: 'grid',
    styles: {
      halign: 'center',
      fontSize: 11,
      cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
      textColor: [40, 40, 40],
      lineWidth: 0.1,
      lineColor: [200, 200, 200],
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 12,
    },
    alternateRowStyles: {
      fillColor: [245, 250, 255],
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // Total Price
const totalPrice = parseInt(booking.booking.amount);
const formattedTotal = `Rp ${totalPrice.toLocaleString('id-ID')}`;
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Price: ${formattedTotal}`, 14, finalY);

  // Footer
  const footerY = finalY + 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text('Thank you for your booking!', 14, footerY);
  doc.setFontSize(10);
  doc.text(
    'If you have any questions, please contact our support team.',
    14,
    footerY + 6,
  );

  doc.save(`Booking_Receipt_${booking.user?.name}.pdf`);
};
