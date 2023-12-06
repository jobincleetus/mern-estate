import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';


dotenv.config();
mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Connected!'))
    .catch((err) => console.log(err));

const app = express();

app.listen(3000, () => {
    console.log('App is running')
})

app.use('/api/user', userRouter);