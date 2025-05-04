import categoryController from '@/controllers/category.controller';
import { verifyUser } from '@/middalewares/auth.middleware';
import { Router } from 'express';

export const categoryRouter = () => {
  const router = Router();

  router.get('/', categoryController.getAllCategory);
  router.get('/list/tenant', verifyUser, categoryController.getAllDataByUserId);
  router.get('/:id', verifyUser, categoryController.getCategoryById);
  router.post('/', verifyUser, categoryController.createCategory);
  router.put('/:id', verifyUser, categoryController.updateCategory);
  router.delete('/:id', verifyUser, categoryController.deleteCategory);

  return router;
};
