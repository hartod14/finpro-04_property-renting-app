import propertyController from "@/controllers/property.controller";
import { Router } from "express";

export const propertyRouter = () => {
    const router = Router()

    router.get('/', propertyController.getAllProperty)
    router.get('/recommended', propertyController.getRecommendedProperties)
    router.get('/slug/:slug', propertyController.getPropertyBySlug)
    router.get('/slug/:slug/rooms', propertyController.getRoomsByPropertySlug)
    router.get('/:id', propertyController.getPropertyById)


    return router
}