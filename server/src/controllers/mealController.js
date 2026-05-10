import Meal from '../models/mealModel.js'

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
        const { tag } = req.query // /api/meals?tag=vegan
        const filter = tag ? { tags: tag } : {}
        const meals = (await Meal.find(filter)).toSorted({ createdAt: -1 })
        res.json(meals)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/meals/:id - single meal
mealController.getMealById = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id)
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
        const meal = await new Meal({
            name,
            tags,
            ingredients,
            totals,
            createdBy: req.user.sub  // comes from jwt via requireAuth
        }).save()
        res.status(201).json(meal)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/meals/:id (protected, only owner)
mealController.deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id)
        if (!meal) return res.status(404).json({ error: 'Meal not found' })
        if (meal.createdBy !== req.user.sub) return res.status(403).json({ error: 'forbidden' })
        await meal.deleteOne()
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}