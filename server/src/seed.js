import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { User, Counter } from './models/userModel.js'
import Meal from './models/mealModel.js'
import Ingredient from './models/ingredientModel.js'
import bcrypt from 'bcrypt'

const seed = async () => {
    await connectDB()

    // clear existing data
    await User.deleteMany({})
    await Meal.deleteMany({})
    await Ingredient.deleteMany({})
    await Counter.findByIdAndDelete('userId')

    console.log('cleared existing data')

    // seed ingredients
    const ingredients = await Ingredient.insertMany([
        {
            fdcId: 2341530,
            name: 'Chicken breast, raw',
            category: 'Poultry Products',
            per100g: { calories: 120, protein: 22.5, fat: 2.6, carbs: 0, fiber: 0, sugar: 0 }
        },
        {
            fdcId: 169704,
            name: 'Rice, white, long-grain, dry',
            category: 'Cereal Grains and Pasta',
            per100g: { calories: 365, protein: 7.1, fat: 0.7, carbs: 80, fiber: 1.3, sugar: 0 }
        },
        {
            fdcId: 170381,
            name: 'Broccoli, raw',
            category: 'Vegetables and Vegetable Products',
            per100g: { calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6, fiber: 2.6, sugar: 1.7 }
        },
        {
            fdcId: 171705,
            name: 'Salmon, atlantic, raw',
            category: 'Finfish and Shellfish Products',
            per100g: { calories: 208, protein: 20, fat: 13, carbs: 0, fiber: 0, sugar: 0 }
        },
        {
            fdcId: 169655,
            name: 'Oats, rolled, dry',
            category: 'Cereal Grains and Pasta',
            per100g: { calories: 389, protein: 16.9, fat: 6.9, carbs: 66, fiber: 10.6, sugar: 0 }
        },
        {
            fdcId: 173944,
            name: 'Eggs, whole, raw',
            category: 'Dairy and Egg Products',
            per100g: { calories: 143, protein: 13, fat: 9.5, carbs: 0.7, fiber: 0, sugar: 0.4 }
        },
        {
            fdcId: 170379,
            name: 'Sweet potato, raw',
            category: 'Vegetables and Vegetable Products',
            per100g: { calories: 86, protein: 1.6, fat: 0.1, carbs: 20, fiber: 3, sugar: 4.2 }
        },
    ])

    console.log('seeded ingredients')

    // seed users
    const password = await bcrypt.hash('Password123', 12)
    const users = []
    const names = ['Alice Johnson', 'Bob Smith', 'Clara Reyes', 'David Lee', 'Emma Wilson']

    for (let i = 0; i < names.length; i++) {
        const counter = await Counter.findByIdAndUpdate(
            'userId',
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        )
        const user = await new User({
            id: counter.seq,
            name: names[i],
            email: `${names[i].split(' ')[0].toLowerCase()}@example.com`,
            password
        }).save()
        users.push(user)
    }

    console.log('seeded users')

    // helper to find ingredient by name
    const ing = (name, amount) => {
        const found = ingredients.find(i => i.name === name)
        return { ...found.toObject(), amount }
    }

    const calcTotals = (ings) => ings.reduce((t, i) => {
        const r = i.amount / 100
        return {
            calories: t.calories + i.per100g.calories * r,
            protein:  t.protein  + i.per100g.protein  * r,
            fat:      t.fat      + i.per100g.fat       * r,
            carbs:    t.carbs    + i.per100g.carbs     * r,
            fiber:    t.fiber    + i.per100g.fiber     * r,
            sugar:    t.sugar    + i.per100g.sugar     * r,
        }
    }, { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0 })

    // seed meals
    const mealsData = [
        {
            name: 'Chicken & Rice',
            tags: ['healthy', 'high protein'],
            createdBy: users[0].id,
            ingredients: [ing('Chicken breast, raw', 200), ing('Rice, white, long-grain, dry', 100)]
        },
        {
            name: 'Salmon with Broccoli',
            tags: ['healthy', 'low carb'],
            createdBy: users[1].id,
            ingredients: [ing('Salmon, atlantic, raw', 180), ing('Broccoli, raw', 150)]
        },
        {
            name: 'Oatmeal with Eggs',
            tags: ['healthy', 'high protein'],
            createdBy: users[2].id,
            ingredients: [ing('Oats, rolled, dry', 80), ing('Eggs, whole, raw', 120)]
        },
        {
            name: 'Sweet Potato Bowl',
            tags: ['healthy', 'vegan', 'vegetarian'],
            createdBy: users[3].id,
            ingredients: [ing('Sweet potato, raw', 300), ing('Broccoli, raw', 100)]
        },
        {
            name: 'Egg & Rice Bowl',
            tags: ['high protein', 'bulking'],
            createdBy: users[4].id,
            ingredients: [ing('Eggs, whole, raw', 200), ing('Rice, white, long-grain, dry', 150)]
        },
        {
            name: 'Chicken & Broccoli',
            tags: ['healthy', 'high protein', 'low carb'],
            createdBy: users[0].id,
            ingredients: [ing('Chicken breast, raw', 250), ing('Broccoli, raw', 200)]
        },
    ]

    await Meal.insertMany(
        mealsData.map(m => ({ ...m, totals: calcTotals(m.ingredients) }))
    )

    console.log('seeded meals')
    console.log('done! ✓')
    mongoose.connection.close()
}

seed().catch(err => {
    console.error(err)
    mongoose.connection.close()
})