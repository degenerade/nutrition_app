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
}, { timeseries: true })

export default mongoose.model('Meal', mealSchema)