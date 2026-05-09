import express from "express"
import { router as messageRoute } from './messageRoutes.js'
import { router as nutritionRoutes } from './nutritionRoutes.js'
import { router as userRoutes } from './userRoutes.js'

const router = express.Router()

router.use('/', messageRoute)

router.use('/api/nutrition', nutritionRoutes)

router.use('/api/users', userRoutes)

export { router }