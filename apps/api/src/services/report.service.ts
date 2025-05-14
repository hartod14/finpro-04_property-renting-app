import { PrismaClient } from "@prisma/client";
import { differenceInDays } from "date-fns";

const prisma = new PrismaClient();

export class ReportService {
  async getSalesReport(tenantId: number, filter: {
    startDate?: Date;
    endDate?: Date;
    sortBy?: "date" | "total_sales";
    order?: "asc" | "desc";
  }) {
    const { startDate, endDate, sortBy = "date", order = "desc" } = filter;

    const bookings = await prisma.booking.findMany({
      where: {
        room: {
          property: {
            tenant_id: tenantId,
          },
        },
        payment: {
          payment_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        status: "DONE",
      },
      include: {
        room: {
          include: {
            property: true,
          },
        },
        user: true,
        payment: true,
      },
    });

    // Hitung total amount berdasarkan payment.amount pada tabel payment
    const enrichedBookings = bookings.map((b) => {
      const totalAmount = b.payment.amount.toNumber();  // Ambil amount dari payment

      return {
        ...b,
        totalAmount,
      };
    });

    // Urutkan jika berdasarkan total sales atau payment date
    if (sortBy === "total_sales") {
      enrichedBookings.sort((a, b) => {
        const diff = a.totalAmount - b.totalAmount;
        return order === "asc" ? diff : -diff;
      });
    } else {
      enrichedBookings.sort((a, b) => {
        const dateA = a.payment.payment_date ? new Date(a.payment.payment_date).getTime() : 0;
        const dateB = b.payment.payment_date ? new Date(b.payment.payment_date).getTime() : 0;
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    // Hitung total income berdasarkan payment.amount
    const totalIncome = enrichedBookings.reduce(
      (acc, b) => acc + b.totalAmount,
      0
    );

    return {
      totalIncome,
      bookings: enrichedBookings.map((b) => ({
        bookingId: b.id,
        orderNumber: b.order_number,
        user: b.user.name,
        property: b.room.property.name,
        room: b.room.name,
        amount: b.totalAmount,
        paymentDate: b.payment.payment_date,
      })),
    };
  }


  async getPropertyCalendar(tenantId: number) {
    const properties = await prisma.property.findMany({
      where: {
        tenant_id: tenantId,
      },
      include: {
        rooms: {
          include: {
            roomHasUnavailableDates: {
              include: {
                roomUnavailableDate: true,
              },
            },
            bookings: {
              where: {
                status: "DONE",
              },
              select: {
                checkin_date: true,
                checkout_date: true,
              },
            },
          },
        },
      },
    });

    return properties.map((property) => ({
      propertyId: property.id,
      propertyName: property.name,
      rooms: property.rooms.map((room) => ({
        roomId: room.id,
        roomName: room.name,
        unavailableDates: room.roomHasUnavailableDates.map((d) => ({
          start: d.roomUnavailableDate.start_date,
          end: d.roomUnavailableDate.end_date,
        })),
        bookedDates: room.bookings.map((b) => ({
          start: b.checkin_date,
          end: b.checkout_date,
        })),
      })),
    }));
  }
}
