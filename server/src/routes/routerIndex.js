import express from 'express'
import { router as authRoutes } from './authRoute.js'
import { router as nutritionRoutes } from './nutritionRoute.js'
import { router as userRoutes } from './userRoute.js'
import { router as mealRoutes } from './mealRoute.js'
import { router as statsRoutes } from './statsRoute.js'

const router = express.Router()

router.use('/nutrition',    nutritionRoutes)
router.use('/auth',         authRoutes)
router.use('/users',        userRoutes)
router.use('/meals',        mealRoutes)
router.use('/stats',        statsRoutes)

export { router }