import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import listingRouter from './routes/listing.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Connected!'))
    .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cookieParser())

app.listen(3000, () => {
    console.log('App is running')
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(status).json({
        success: false,
        status,
        message
    });
});