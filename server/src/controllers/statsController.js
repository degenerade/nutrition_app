import { mealModel } from '../models/mealModel.js'
import { model as userModel } from '../models/userModel.js'

export const statsController = {}

statsController.getStats = async (req, res) => {
    try {
        const meals = await mealModel.findMeals()
        const users = await userModel.findUsers()

        const totalCalories = meals.reduce((sum, m) => + (m.totals?.calories    ?? 0), 0)
        const totalProtein  = meals.reduce((sum, m) => + (m.totals?.protein     ?? 0), 0)
        const totalCarbs    = meals.reduce((sum, m) => + (m.totals?.carbs       ?? 0), 0)
        const totalFat      = meals.reduce((sum, m) => + (m.totals?.fat         ?? 0), 0)

        const avgCalories = meals.length ? totalCalories / meals.length : 0

        const tagCounts = meals.reduce((acc, meal) => {
            (meals.tags ?? []).forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1
            })
            return acc
        }, {})

        const mostPopularTag = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

        res.json({
            totalMeals:     meals.length,
            totalUser:      users.length,
            avgCalories:    Math.round(avgCalories),
            avgProtein:     Math.round(totalProtein / (meals.length || 1)),
            avgCarbs:       Math.round(totalCarbs   / (meals.length || 1)),
            avgFat:         Math.round(totalFat     / (meals.length || 1)),
            mostPopularTag,
            tagCounts,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}