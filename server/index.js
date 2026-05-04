import express from 'express'
import { connectDB } from './config/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
import { router } from './routes/routerIndex.js'

dotenv.config()
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/', router)

const start = async () => {
    await connectDB()
    app.listen(process.env.PORT, () => console.log(`Server on :${process.env.PORT}`))
}

start()
