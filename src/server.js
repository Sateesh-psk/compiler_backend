import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import codeRoutes from "./routes/code.routes.js";
import executeRoutes from "./routes/execution.routes.js";
import spotifyAuthRoutes from "./routes/spotifyAuth.routes.js";

dotenv.config()
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());


const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:  function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}))

app.use("/user",userRoutes)
app.use("/code",codeRoutes)
app.use("/execute",executeRoutes)
app.use('/spotify', spotifyAuthRoutes);

const PORT = process.env.PORT
app.listen(PORT,()=>{
  console.log(`Server started on port:${PORT}`);
  connectDB();
})