import tenantPropertyRoomController from '@/controllers/tenant-property-room.controller';
import tenantPropertyController from '@/controllers/tenant-property.controller';
import { authorizePropertyOwner } from '@/middalewares/authorizePropertyOwner.middleware';
import { Router } from 'express';

export const tenantPropertyRouter = () => {
  const router = Router();

  router.get('/', tenantPropertyController.getAllData);
  router.get(
    '/:id',
    authorizePropertyOwner,
    tenantPropertyController.getPropertyById,
  );
  router.post('/', tenantPropertyController.createData);
  router.put(
    '/:id',
    authorizePropertyOwner,
    tenantPropertyController.updateData,
  );
  router.delete(
    '/:id',
    authorizePropertyOwner,
    tenantPropertyController.deleteData,
  );

  //room
  router.get(
    '/:id/room',
    authorizePropertyOwner,
    tenantPropertyRoomController.getRoomByPropertyId,
  );

  return router;
};

export default tenantPropertyRouter;
