import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import codeRoutes from "./routes/code.routes.js";
import executeRoutes from "./routes/execution.routes.js";
import spotifyAuth from "./routes/spotify.routes.js";

dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use("/user",userRoutes)
app.use("/code",codeRoutes)
app.use("/execute",executeRoutes)
app.use('/spotify', spotifyAuth);

const PORT = process.env.PORT
app.listen(PORT,()=>{
  console.log(`Server started on port:${PORT}`);
  connectDB();
})