import { PrismaClient } from '@prisma/client';
import { BookingStatus, PaymentMethod } from '@prisma/client';
import { sendConfirmationEmail } from '@/utils/email';

const prisma = new PrismaClient();

export const tenantTransactionService = {
  async getTenantOrders(tenantId: number, status?: BookingStatus) {
    return await prisma.booking.findMany({
      where: {
        room: {
          property: {
            tenant_id: tenantId,
          },
        },
        ...(status && { status }),
      },
      include: {
        room: {
          include: {
            property: {
              include: {
                propertyImages: true,
              },
            },
          },
        },
        user: true,
        payment: true,
      },
      orderBy: {
        room: {
          property: {
            id: 'asc',
          },
        },
      },
    });
  },

  async getPropertyList(tenantId: number) {
    return await prisma.property.findMany({
      where: {
        tenant_id: tenantId,
      },
      include: {
        rooms: true,
        propertyImages: true,
      },
    });
  },

  async confirmPayment(tenantId: number, bookingId: number, accept: boolean) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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

    if (!booking || booking.room.property.tenant_id !== tenantId) {
      throw new Error('Unauthorized or booking not found');
    }

    if (booking.payment?.method !== PaymentMethod.MANUAL) {
      throw new Error('Only manual payment confirmation is allowed');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: accept ? BookingStatus.DONE : BookingStatus.REJECTED,
      },
    });

    if (accept) {
      await sendConfirmationEmail(booking.user.email, booking);
    }

    return updatedBooking;
  },

  async cancelUserOrder(tenantId: number, bookingId: number) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: {
            property: true,
          },
        },
        payment: true,
      },
    });

    if (!booking || booking.room.property.tenant_id !== tenantId) {
      throw new Error('Unauthorized or booking not found');
    }

    if (booking.payment?.proof) {
      throw new Error('Cannot cancel order with uploaded payment proof');
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  },
};
