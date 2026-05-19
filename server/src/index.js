require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const connectDB = require('./config/db')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
const inquiryRoutes = require('./routes/inquiryRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const userRoutes = require('./routes/userRoutes')
const visitRoutes = require('./routes/visitRoutes')

const app = express()
const port = process.env.PORT || 4000

connectDB()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(cookieParser())
app.use(express.json())

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/', (req, res) => {
  res.json({
    message: 'NestIQ API is running',
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NestIQ API',
    environment: process.env.NODE_ENV || 'development',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/users', userRoutes)
app.use('/api/visits', visitRoutes)
app.use('/api/properties', propertyRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`NestIQ API running on port ${port}`)
})
