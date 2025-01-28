const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const adminRouter = require('./routers/adminRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
const { errorResponse } = require('./controllers/responseController');


const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: 'Too many requests, Please try again later',
});
app.use(rateLimiter);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.get('/test', (req, res) =>{
    res.status(200).send({
        message: 'Test is working',
    });
});

// Client Error Handling
app.use((req, res, next) => {
    next(createError(404, 'Route not found'));
});
// Server Error Handling
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    });
    next();
});

module.exports = app;