import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './src/db/connectDb';
import authRoute from './src/db/routes/auth.route';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response)=>{
    res.send("this is root");
});

app.use('/api/auth', authRoute);

app.listen(PORT, ()=>{
    connectDb();
    console.log(`server is running port no ${PORT}`);
})