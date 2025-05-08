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

  router.get(
    '/:id/room/:roomId',
    authorizePropertyOwner,
    tenantPropertyRoomController.getRoomById,
  );

  router.post(
    '/:id/room',
    authorizePropertyOwner,
    tenantPropertyRoomController.createRoom,
  );


  router.put(
    '/:id/room/:roomId',
    authorizePropertyOwner,
    tenantPropertyRoomController.updateRoom,
  );

  router.delete(
    '/:id/room/:roomId',
    authorizePropertyOwner,
    tenantPropertyRoomController.deleteRoom,
  );

  return router;
};

export default tenantPropertyRouter;
