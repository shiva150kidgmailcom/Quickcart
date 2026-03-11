import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB Connected"));
}

