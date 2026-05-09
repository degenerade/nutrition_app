import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router } from './routes/routerIndex.js'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api', router)

export default app