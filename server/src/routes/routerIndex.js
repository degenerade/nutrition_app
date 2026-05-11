import express from 'express'
import { router as authRoutes } from './authRoute.js'
import { router as ingredientRoutes } from './ingredientRoute.js'
import { router as userRoutes } from './userRoute.js'
import { router as mealRoutes } from './mealRoute.js'
import { router as statsRoutes } from './statsRoute.js'

const router = express.Router()

router.use('/ingredient',    ingredientRoutes)
router.use('/auth',         authRoutes)
router.use('/users',        userRoutes)
router.use('/meals',        mealRoutes)
router.use('/stats',        statsRoutes)

export { router }