import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import transactionRoutes from './routes/transactions';
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import { protect } from './middleware/auth';


// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', protect, transactionRoutes);
app.use('/api/upload', protect, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Money Tracker API is running' });
});

export default app;
