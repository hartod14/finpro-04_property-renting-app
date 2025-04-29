import propertyController from "@/controllers/property.controller";
import { Router } from "express";

export const propertyRouter = () => {
    const router = Router()

    router.get('/', propertyController.getAllProperty)

    return router
}