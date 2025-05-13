import { ErrorHandler, responseHandler } from '../helpers/response.handler';
import reviewService from '../services/review.service';
import { NextFunction, Request, Response } from 'express';

class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, rating, comment } = req.body;
      const userId = (req as Request & { user?: { id: number } }).user?.id;

      if (!userId) {
        res.status(400).json({ message: 'User is not authenticated' });
        return;
      }

      const review = await reviewService.createReview({
        bookingId,
        rating,
        comment,
        userId,
      });
      responseHandler(res, 'Review created successfully', review); // <== tanpa return
    } catch (error) {
      next(error);
    }
  }

  async replyReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = parseInt(req.params.id, 10);
      const tenantId = (req as Request & { user?: { id: number } }).user?.id;
      const { reply } = req.body;

      if (!tenantId) {
        res.status(400).json({ message: 'Tenant is not authenticated' });
        return;
      }

      const review = await reviewService.replyReview({
        reviewId,
        tenantId,
        reply,
      });
      responseHandler(res, 'Reply added successfully', review); // <== tanpa return
    } catch (error) {
      next(error);
    }
  }

  async getReviewsByProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = parseInt(req.params.propertyId, 10);

      if (isNaN(propertyId)) {
        res.status(400).json({ message: 'Invalid Property ID' });
        return;
      }

      const reviews = await reviewService.getReviewsByProperty(propertyId);
      responseHandler(res, 'Reviews fetched successfully', reviews); // tanpa return
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
