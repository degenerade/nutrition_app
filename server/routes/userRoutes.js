import express from 'express'
import { controller as userController } from '../controllers/userController.js'

const router = express.Router()

router.get('/users', userController.getUsers)

router.get('/users/:id', userController.getUserById)

router.post('/users', userController.addUser)

//router.patch('/users/:id', userController.updateUser)

//router.delete('/users/:id', userController.deleteUser)

export { router }