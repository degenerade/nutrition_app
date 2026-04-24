import express from "express"
import { router as messageRoute } from './messageRoutes.js'
import { router as nutritionRoutes } from './nutritionRoutes.js'

const router = express.Router()

router.use('/', messageRoute)

router.use('/api/nutrition', nutritionRoutes)

export { router }