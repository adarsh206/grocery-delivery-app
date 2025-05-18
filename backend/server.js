import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB()

// Allowed multiple origins
const allowedOrigins =['http://localhost:5173'];

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/', (req, res) => res.send('Api is running!'));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})