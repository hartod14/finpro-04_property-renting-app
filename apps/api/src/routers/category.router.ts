import categoryController from "@/controllers/category.controller"
import { Router } from "express"

export const categoryRouter = () => {
    const router = Router()

    router.get('/', categoryController.getAllCategory)

    return router
} 