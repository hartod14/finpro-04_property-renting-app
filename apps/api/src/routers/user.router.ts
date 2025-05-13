import { Router } from "express"
import userController from "../controllers/user.controller"

export const userRouter = () => {
    const router= Router()

    router.get('/tenant-role', userController.getAllTenant)

    return router
}