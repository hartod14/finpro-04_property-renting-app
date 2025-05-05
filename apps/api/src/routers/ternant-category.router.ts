import tenantCategoryController from '@/controllers/tenant-category.controller';
import { Router } from 'express';

export const tenantCategoryRouter = () => {
  const router = Router();

  router.get('/', tenantCategoryController.getAllData);
  router.get('/:id', tenantCategoryController.getCategoryById);
  router.post('/', tenantCategoryController.createCategory);
  router.put('/:id', tenantCategoryController.updateCategory);
  router.delete('/:id', tenantCategoryController.deleteCategory);

  return router;
};
