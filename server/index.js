import express from 'express'
import mongoose, { get }  from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { router } from './routes/routerIndex.js'

dotenv.config()
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/', router)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err.message))

app.listen(process.env.PORT, () => console.log(`Server on :${process.env.PORT}`))