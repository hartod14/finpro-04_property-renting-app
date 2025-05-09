import tenantRoomAvailabilityController from '@/controllers/tenant-room-availability.controller';
import { Router } from 'express';

export const tenantRoomAvailabilityRouter = () => {
  const router = Router();

  router.get('/', tenantRoomAvailabilityController.getAllData);
  router.post('/', tenantRoomAvailabilityController.createData);
  router.delete('/:id', tenantRoomAvailabilityController.deleteData);

  return router;
};
