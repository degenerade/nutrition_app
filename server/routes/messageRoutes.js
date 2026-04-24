import express from 'express'
import { controller as messageController } from '../controllers/messgageController.js'

export const router = express.Router()

router.get('/', messageController.serverMessage)