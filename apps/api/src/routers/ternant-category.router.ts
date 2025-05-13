import tenantCategoryController from '../controllers/tenant-category.controller';
import { Router } from 'express';
import { authorizeCategoryOwner } from '../middalewares/authorizeCategoryOwner.middleware';

export const tenantCategoryRouter = () => {
  const router = Router();

  router.get('/', tenantCategoryController.getAllData);
  router.get('/:id', authorizeCategoryOwner, tenantCategoryController.getCategoryById);
  router.post('/', tenantCategoryController.createCategory);
  router.put('/:id', authorizeCategoryOwner, tenantCategoryController.updateCategory);
  router.delete('/:id', authorizeCategoryOwner, tenantCategoryController.deleteCategory);

  return router;
};
