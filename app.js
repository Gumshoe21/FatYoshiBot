const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const commandRouter = require('./routes/userRoutes');
const app = express();

// By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have knowledge that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted, which otherwise may be easily spoofed.
app.enable('trust proxy');
/*
app.use(
  cors({
    origin: ['https://12hourstudy.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);
*/
app.options('*', cors());

// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());

// HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(hpp());

// rate limiting
const limiter = rateLimit({
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP; please try again in an hour.'
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(`/api/${process.env.API_VERSION}/users`, userRouter);

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find URL ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
