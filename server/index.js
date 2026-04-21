import express from 'express'
import mongoose  from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http//localhost:5173' }))
app.use(express.json)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.get('/api/health', (req, res) => res.json({ ok:true }))

app.listen(3000, () => console.log('Server on :3000'))