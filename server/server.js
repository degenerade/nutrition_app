import 'dotenv/config'
import app from './src/app.js'
import { connectDB } from './src/config/db.js'

const start = async () => {
    await connectDB()
    app.listen(process.env.PORT,  () => console.log(`Server in :${process.env.PORT}`))
}

start()