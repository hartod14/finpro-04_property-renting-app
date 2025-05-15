import tenantSeasonRateController from '../controllers/tenant-season-rate.controller';
import { Router } from 'express';

export const tenantSeasonRateRouter = () => {
  const router = Router();

  router.get('/', tenantSeasonRateController.getAllData);
  router.get('/:id', tenantSeasonRateController.getDataById);
  router.post('/', tenantSeasonRateController.createData);
  router.put('/:id', tenantSeasonRateController.updateData);
  router.delete('/:id', tenantSeasonRateController.deleteData);

  return router;
}; 