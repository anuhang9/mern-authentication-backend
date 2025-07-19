import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './db/connectDb';
import authRoute from './routes/auth.route';
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());

app.get('/', (req: Request, res: Response)=>{
    res.send("this is root");
});

app.use('/api/auth', authRoute);

app.listen(PORT, ()=>{
    connectDb();
    console.log(`server is running port no ${PORT}`);
})