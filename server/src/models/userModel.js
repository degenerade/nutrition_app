import mongoose from 'mongoose'
import bcrypt, { compare } from 'bcrypt'

const counterSchema = new mongoose.Schema({
    _id: String,
    seq: { type: Number, default: 0 }
})

export const Counter = mongoose.model('Counter', counterSchema)

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)

export const model = {}

model.findUsers = async () => {
    return await User.find()
}

model.findUserById = async (id) => {
    return await User.findOne({ id: parseInt(id, 10) })
}

model.addUser = async (user) => {
    const {name, email, password } = user
    const counter = await Counter.findByIdAndUpdate(
        'userId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    const hashed = await bcrypt.hash(password, 12)
    const newUser = new User({ id: counter.seq, name, email, password: hashed })
    const saved = await newUser.save()
    return saved.id
}

model.updateUser = async (id, updates) => {
    return await User.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { $set: updates },
        { new: true }
    )
}

model.deleteUser = async (id) => {
    return await User.findOneAndDelete({ id: parseInt(id, 10) })
}

model.verifyPassword = async (plaintext, hash) => {
    return await bcrypt.compare(plaintext, hash)
}