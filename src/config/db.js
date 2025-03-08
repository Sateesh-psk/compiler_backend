import mongoose from "mongoose"

export const connectDB = async () =>{
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI,{dbName:"compilerCH"})
    console.log(`connection is successful on host: ${conn.connection.host}`)
  }catch(err){
    console.log("Error in connecting to mongodb: ",err);
  }
}