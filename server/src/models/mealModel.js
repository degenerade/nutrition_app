import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
    name: String,
    tags: [String],
    ingredients: [{
        fdcId: Number,
        name: String,
        amount: Number,
        per100g: {
            calories: Number,
            protein: Number,
            fat: Number,
            carbs: Number,
            fiber: Number,
            sugar: Number
        }
    }]
})

export default mongoose.model('Meal', mealSchema)