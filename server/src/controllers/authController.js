import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User, Counter } from '../models/userModel.js'
import { email } from 'zod'

const signToken = (user) =>
    jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

const controller = {}

controller.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existing = await User.findOne({ email })
        if (existing) return res.status(409).json({ error: 'Email already in use' })
        
        const hashed = await bcrypt.hash(password, 12)

        const counter = await Counter.findByIdAndUpdate(
            'userId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )

        const user = await new User({ id: counter.seq, name, email, password: hashed }).save()
        const token = signToken(user)

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

controller.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ error: 'Invalid email or password' })
        
        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ error: 'Invalid email or password' })

        const token = signToken(user)

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export { controller }