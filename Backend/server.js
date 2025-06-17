import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskroutes.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import './config/passport.js';

dotenv.config();
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST','PUT','DELETE',"PATCH"],
    allowedHeaders: ['Content-Type'],
    credentials: true,  
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log( process.env.DATABASE_URL); // must be 'string'
    console.log(`Server running on port ${PORT}`)

});
