import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import Razorpay from 'razorpay';

import { connectDb } from "./db/conn.js";
dotenv.config();
const app = express();

// call DB function to connect database
connectDb();

export const instance = new Razorpay({
    key_id : process.env.RAZORPAY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET
});

const PORT = process.env.PORT || 8001;

app.use(cors());

// get static image
app.use('/Uploads', express.static("uploads"))

// Using ALL Middlewarae
app.use(express.json());

// Import all the routes
import adminRoute from './routes/adminRoute.js';
import userRoute from './routes/userRoute.js';
import courseRoute from './routes/courseRoute.js';

//  call the routes
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/course', courseRoute);


app.listen(PORT, ()=>{
    console.log(`listen on port ${PORT}`);
})
