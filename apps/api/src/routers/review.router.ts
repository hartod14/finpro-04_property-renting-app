import reviewController from '../controllers/review.controller';
import { verifyUser } from '../middalewares/auth.middleware';
import { Router } from 'express';

export const reviewRouter = () => {
  const router = Router();

  router.post('/create', verifyUser, reviewController.createReview);
  router.post('/reply/:id', verifyUser, reviewController.replyReview);
  router.get('/property/:propertyId', reviewController.getReviewsByProperty);

  return router;
};

export default reviewRouter;
