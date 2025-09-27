import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from '../server/src/config/db.js';
import cors from 'cors';

import AuthRouter from './src/routes/authRoutes.js';
import UserRoute from './src/routes/userRoute.js';
import ProjectThemeRouter from './src/routes/projectThemeRoute.js';

import ProblemStatementRoute from './src/routes/problemStatementRoute.js';


const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRoute);
app.use('/api/theme', ProjectThemeRouter);




app.use('/api/problem', ProblemStatementRoute);


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        url: req.url,
        method: req.method,
        body: req.body,
        headers: req.headers
    });
    const errorMessage = err.message || 'Internal Server Error';
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: errorMessage,
        statusCode: statusCode
    });
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});