import express from 'express'
import { z } from 'zod'
import { controller as userController } from '../controllers/userController.js'

const router = express.Router()

// schemas
const createUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/, 'Need one uppercase').regex(/[0-9]/, 'Need one number')
})

const updateUserSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).optional()
}).strict()

// validation
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }
    req.body = result.data
    next()
}

// routes
router.get('/', userController.getUsers)

router.get('/:id', userController.getUserById)

router.post('/', validate(createUserSchema), userController.addUser)

router.patch('/:id', validate(updateUserSchema), userController.updateUser)

router.delete('/:id', userController.deleteUser)

export { router }