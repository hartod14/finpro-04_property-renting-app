import tenantRoomAvailabilityController from '../controllers/tenant-room-availability.controller';
import { Router } from 'express';

export const tenantRoomAvailabilityRouter = () => {
  const router = Router();

  router.get('/', tenantRoomAvailabilityController.getAllData);
  router.get('/:id', tenantRoomAvailabilityController.getDataById);
  router.post('/', tenantRoomAvailabilityController.createData);
  router.put('/:id', tenantRoomAvailabilityController.updateData);
  router.delete('/:id', tenantRoomAvailabilityController.deleteData);

  return router;
};
