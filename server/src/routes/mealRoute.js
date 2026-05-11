import express from 'express'
import { mealController } from '../controllers/mealController.js'
import { requiresAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/',         mealController.getMeals)
router.get('/:id',      mealController.getMealById)
router.post('/',        requiresAuth, mealController.createMeal)
router.patch('/:id',    requiresAuth, mealController.updateMeal)
router.delete('/:id',   requiresAuth, mealController.deleteMeal)

export { router }