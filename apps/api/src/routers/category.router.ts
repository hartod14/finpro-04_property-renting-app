import categoryController from '../controllers/category.controller';
import { verifyUser } from '../middalewares/auth.middleware';
import { Router } from 'express';

export const categoryRouter = () => {
  const router = Router();

  router.get('/', categoryController.getAllCategory);
 

  return router;
};
