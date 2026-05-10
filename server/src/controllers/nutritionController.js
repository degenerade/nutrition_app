export const searchIngredient = async (req, res) => {
    try {
        const { ingredient } = req.params
        const { category } = req.query
        const categoryParam = category ? `,${encodeURIComponent(category)}` : ''
        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(req.params.ingredient)}&dataType=Foundation,SR Legacy&pageSize=5&api_key=${process.env.USDA_API_KEY}`
        )
        const data = await response.json()

        const getNutrient = (food, id) =>
            food.foodNutrients.find(n => n.nutrientId === id)?.value ?? 0

        const results = data.foods
            .filter(food => !category || food.foodCategory === category)
            .filter(food => getNutrient(food, 1008) > 0) // zero kcal items, eg items that have incomplete data by USDA
            .map(food => ({
                fdcId:      food.fdcId,
                name:       food.description,
                category:   food.foodCategory,
                per100g: {
                    calories:   getNutrient(food, 1008),
                    protein:    getNutrient(food, 1003),
                    fat:        getNutrient(food, 1004),
                    carbs:      getNutrient(food, 1005),
                    fiber:      getNutrient(food, 1079),
                    sugar:      getNutrient(food, 2000)
        }
    }))

    res.json(results)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}