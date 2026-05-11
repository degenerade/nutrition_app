import Meal, { mealModel } from '../models/mealModel.js'

const calculateTotals = (ingredients) => {
    return ingredients.reduce((totals, ing) => {
        const ratio = ing.amount / 100
        return {
            calories:   totals.calories + ing.per100g.calories  * ratio,
            protein:    totals.protein  + ing.per100g.protein   * ratio,
            fat:        totals.fat      + ing.per100g.fat       * ratio,
            carbs:      totals.carbs    + ing.per100g.carbs     * ratio,
            fiber:      totals.fiber    + ing.per100g.fiber     * ratio,
            sugar:      totals.sugar    + ing.per100g.sugar     * ratio
        }
    }, { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0 })
}

export const mealController = {}

// GET /api/meals - all meals for browse page
mealController.getMeals = async (req, res) => {
    try {
        const meals = await mealModel.findMeals(req.query.tag)
        res.json(meals)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/meals/:id - single meal
mealController.getMealById = async (req, res) => {
    try {
        const meal = await mealModel.findMealById(req.params.id)
        if (!meal) return res.status(404).json({ error: 'Meal not found' })
        res.json(meal)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /api/meals - created meal (protected)
mealController.createMeal = async (req, res) => {
    try {
        const { name, tags, ingredients } = req.body
        const totals = calculateTotals(ingredients)
        const meal = await mealModel.createMeal({
            name,
            tags,
            ingredients,
            totals,
            createdBy: req.user.sub  // comes from jwt via requireAuth
        })
        res.status(201).json(meal)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

mealController.updateMeal = async (req, res) => {
    try {
        const meal = await mealModel.findMealById(req.params.id)
        if (!meal) return res.status(404).json({ error: 'Meal not found' })
        if (meal.createdBy !== Number(req.user.sub)) return res.status(403).json({ error: 'Forbidden'})
        const updated = await mealModel.updateMeal(req.params.id, req.body)
        console.log('updated:', updated)
        res.json(updated)
    } catch (err) {
        console.log('update error:', err.message)
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/meals/:id (protected, only owner)
mealController.deleteMeal = async (req, res) => {
    try {
        const meal = await mealModel.findMealById(req.params.id)
        if (!meal) return res.status(404).json({ error: 'Meal not found' })
        if (meal.createdBy !== Number(req.user.sub)) return res.status(403).json({ error: 'forbidden' })
        await mealModel.deleteMeal(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}