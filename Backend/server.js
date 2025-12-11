import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";



// app configurations
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json()) // For parsing json files coming to backend

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin && origin.includes(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now - tighten this in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}))


// DB Connection 
connectDB();

// API Endpoint 
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Http Requests
app.get('/', (req, res) => {
    res.send("API Working")
});


// To Run on port 4000
app.listen(port,()=>{
    console.log(`Server Running on http://localhost:${port}`)
})