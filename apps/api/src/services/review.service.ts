import { ErrorHandler } from '@/helpers/response.handler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ReviewService {
  async createReview({
    bookingId,
    rating,
    comment,
    userId,
  }: {
    bookingId: number;
    rating: number;
    comment: string;
    userId: number;
  }) {
    if (!bookingId || !rating || !comment) {
      throw new ErrorHandler('Invalid input', 400);
    }

    // Cari booking berdasarkan ID
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorHandler('Booking not found', 404);
    }

    // Cek apakah user yang memberikan review adalah pemilik booking
    if (booking.user_id !== userId) {
      throw new ErrorHandler('Unauthorized', 403);
    }

    // Cek status booking
    if (booking.status !== 'DONE') {
      throw new ErrorHandler('Cannot review before check-out', 400);
    }

    // Cek apakah user sudah memberikan review untuk properti ini
    const existingReview = await prisma.review.findFirst({
      where: {
        user_id: userId,
        property_id: booking.room.property_id,
      },
    });

    if (existingReview) {
      throw new ErrorHandler('Review already exists for this booking', 400);
    }

    // Membuat review baru
    return prisma.review.create({
      data: {
        user_id: userId,
        tenant_id: booking.room.property.tenant_id,
        property_id: booking.room.property_id,
        rating,
        comment,
      },
    });
  }

  async replyReview({
    reviewId,
    tenantId,
    reply,
  }: {
    reviewId: number;
    tenantId: number;
    reply: string;
  }) {
    if (!reply) {
      throw new ErrorHandler('Reply cannot be empty', 400);
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ErrorHandler('Review not found', 404);
    }

    if (review.tenant_id !== tenantId) {
      throw new ErrorHandler('Unauthorized', 403);
    }

    if (review.reply) {
      throw new ErrorHandler('Review already has a reply', 400);
    }

    return prisma.review.update({
      where: { id: reviewId },
      data: { reply },
    });
  }

  async getReviewsByProperty(propertyId: number) {
    if (!propertyId) {
      throw new ErrorHandler('Property ID is required', 400);
    }
  
    const reviews = await prisma.review.findMany({
      where: { property_id: propertyId },
      select: {
        id: true,
        rating: true,
        comment: true,
        reply: true, // Tambahkan ini
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
            Booking: {
              select: {
                room: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
          },
        },
        property: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  
    return reviews;
  }  
}


export default new ReviewService();
