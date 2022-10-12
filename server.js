import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import 'express-async-errors'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
// db connection
import connectDB from './db/connect.js'

// routers
import authRouter from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'

// middlewares
import errorHandlerMiddleware from './middleware/error-handler.js'
import noFoundMiddleware from './middleware/not-found.js'

const app = express()

const port = process.env.PORT || 8000

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(cors())
app.use(express.json())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './upload',
  })
)
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/api/instagram/auth', authRouter)
app.use('/api/instagram/post', postRoutes)
app.use(noFoundMiddleware)

app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB()

    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
