import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from '../server/src/config/db.js';
import cors from 'cors';
import AuthRouter from './src/routes/authRoutes.js';
import UserRoute from './src/routes/userRoute.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRoute);


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    const errorMessage = err.message || 'Internal Server Error';
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send(errorMessage);
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});