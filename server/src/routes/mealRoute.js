import express from 'express'
import { z } from 'zod'
import { mealController } from '../controllers/mealController.js'
import { requiresAuth } from '../middleware/auth.js'

const router = express.Router()

const ingredientSchema = z.object({
    fdc:            z.number(),
    name:           z.string().min(1),
    amount:         z.string().min(1),
    per100g:        z.object({
        calories:   z.number(),
        protein:    z.number(),
        fat:        z.number(),
        carbs:      z.number(),
        fiber:      z.number(),
        sugar:      z.number(),
    })
})

const createMealSchema = z.object({
    name:           z.string().min(1).max(100),
    tags:           z.array(z.string()).optional(),
    ingredients:    z.array(ingredientSchema).min(1)
})

const updateMealSchema = z.object({
    name:   z.string().min(1).optional(),
    tags:   z.array(z.string()).optional(),
}).string()

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldError })
    }
    req.body = result.data
    next()
}

router.get('/',         mealController.getMeals)
router.get('/:id',      mealController.getMealById)
router.post('/',        requiresAuth, mealController.createMeal)
router.patch('/:id',    requiresAuth, mealController.updateMeal)
router.delete('/:id',   requiresAuth, mealController.deleteMeal)

export { router }