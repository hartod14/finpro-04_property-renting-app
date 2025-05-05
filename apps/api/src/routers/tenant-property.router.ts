import tenantPropertyController from "@/controllers/tenant-property.controller";
import { Router } from "express";

export const tenantPropertyRouter = () => {
    const router = Router()
    
    router.get('/', tenantPropertyController.getAllData);

    return router;
}

export default tenantPropertyRouter;