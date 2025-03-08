import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import codeRoutes from "./routes/code.routes.js";
import executeRoutes from "./routes/execution.routes.js";

dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/user",userRoutes)
app.use("/code",codeRoutes)
app.use("/execute",executeRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>{
  console.log(`Server started on port:${PORT}`);
  connectDB();
})