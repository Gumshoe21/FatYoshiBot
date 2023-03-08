import express from 'express'
import path from 'path'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import cors from 'cors'
import AppError from './utils/appError'
const app = express()

// By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have knowledge that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted, which otherwise may be easily spoofed.
app.enable('trust proxy')
/*
app.use(
  cors({
    origin: ['https://12hourstudy.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);
*/
app.options('*', cors())

// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet())

// HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }))

app.use(hpp())

// Rate limiting.
const limiter = rateLimit({
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP; please try again in an hour.',
})

app.use('/api', limiter)
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xss())


export default app
