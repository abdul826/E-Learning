import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Db connect successfully");
    } catch (error) {
        console.log("Db Error => " + error);
    }
}