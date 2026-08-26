import mongoose from 'mongoose'

const ingredientSchema = new mongoose.Schema({
    fdcId:  { type: Number, required: true, unique: true },
    name:   { type: String, required: true },
    category: { type: String, }, // grams
    per100g: {
        calories:   { type: Number, required: true},
        protein:    { type: Number, required: true},
        fat:        { type: Number, required: true},
        carbs:      { type: Number, required: true},
        fiber:      { type: Number },
        sugar:      { type: Number }
    }
}, { timestamps: true })

export const ingredientModel = {}

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

ingredientModel.findByFdcId = async (fdcId) => {
    return await Ingredient.findOne({ fdcId })
}

ingredientModel.findByQuery = async (query) => {
    return await Ingredient.find({
        name: { $regex: query, $options: 'i' }
    }).limit(8)
}

ingredientModel.saveIngredient = async (data) => {
    return await Ingredient.findOneAndUpdate(
        { fdcId: data.fdcId },
        data,
        { upsert: true, returnDocument: 'after' }
    )
}

ingredientModel.findAll = async () => {
    return await Ingredient.find()
}

export default Ingredient