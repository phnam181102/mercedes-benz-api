const express = require('express')
const cors = require('cors')
const connectDB = require('../database')
const initWebRoute = require('./router/userRoute')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
connectDB()

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

initWebRoute(app)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
