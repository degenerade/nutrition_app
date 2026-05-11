import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tags: [String],
    createdBy: { type: Number, ref: 'User', required: true },
    ingredients: [{
        fdcId: Number,
        name: String,
        amount: Number, // grams
        per100g: {
            calories: Number,
            protein: Number,
            fat: Number,
            carbs: Number,
            fiber: Number,
            sugar: Number
        }
    }],
    totals: { // amounts saved to not calculate every fetch
        calories: Number,
        protein: Number,
        fat: Number,
        carbs: Number,
        fiber: Number,
        sugar: Number
    }
}, { timestamps: true })

const Meal = mongoose.model('Meal', mealSchema)

export const mealModel = {}

mealModel.findMeals = async (tag) => {
    const filter = tag ? { tags: tag } : {}
    return await Meal.find(filter).sort({ _id: -1 })
}

mealModel.findMealById = async (id) => {
    return await Meal.findById(id)
}

mealModel.createMeal = async (data) => {
    return await new Meal(data).save()
}

mealModel.updateMeal = async (id, updates) => {
    return await Meal.findByIdAndUpdate(
        id,
        { $set: updates },
        { returnDocument: 'after', new: true }
    )
}

mealModel.deleteMeal = async (id) => {
    return await Meal.findByIdAndDelete(id)
}

export default Meal