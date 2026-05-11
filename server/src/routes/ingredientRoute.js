import express from 'express'
import { searchIngredient } from '../controllers/ingredientController.js'

const router = express.Router()

router.get('/:ingredient', searchIngredient)

export { router }