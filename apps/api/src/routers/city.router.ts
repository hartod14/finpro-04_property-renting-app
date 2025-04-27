import cityController from "@/controllers/city.controller"
import { Router } from "express"

export const cityRouter = () => {
    const router = Router()

    router.get('/', cityController.getAllCity)
}