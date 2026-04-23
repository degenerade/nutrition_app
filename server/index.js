import express from 'express'
import mongoose, { get }  from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err.message))

app.get('/api/health', (req, res) => res.json({ ok:true }))

app.get('/', (req, res) => {
    res.send('Server is running...')
})

app.get('/api/message', (req, res) => {
    res.json({message: 'Message from backend...'})
})

app.get('/api/nutrition/:ingredient', async (req, res) => {
    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.params.ingredient}&dataType=Foundation,SR Legacy&pageSize=5&api_key=${process.env.USDA_API_KEY}`
    )
    const data = await response.json()

    const getNutrient = (food, id) =>
        food.foodNutrients.find(n => n.nutrientId === id)?.value ?? 0

    const results = data.foods.map(food => ({
        fdcId: food.fcdId,
        name: food.description,
        per100g: {
            calories: getNutrient(food, 1008),
            protein: getNutrient(food, 1003),
            fat: getNutrient(food, 1004),
            carbs: getNutrient(food, 1005),
            fiber: getNutrient(food, 1079),
            sugar: getNutrient(food, 2000)
        }
    }))

    res.json(results)
})

app.listen(process.env.PORT, () => console.log(`Server on :${process.env.PORT}`))