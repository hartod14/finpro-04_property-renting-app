import facilityController from "../controllers/facility.controller"
import { Router } from "express"

export const facilityRouter = () => {
    const router = Router()

    router.get('/', facilityController.getAllFacility)

    return router
} 