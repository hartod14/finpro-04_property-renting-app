import tenantRoomAvailabilityController from '@/controllers/tenant-room-availability.controller';
import { Router } from 'express';

export const tenantRoomAvailabilityRouter = () => {
  const router = Router();

  router.get('/', tenantRoomAvailabilityController.getAllData);

  return router;
};
