import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req,res,next) => {
  try{
    const token = req.cookies.jwt;
    
    if(!token) return res.status(400).json({message:"Unautheriozed - No Token Found"});

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decoded) return res.status(400).json({message:"Unautheriozed - Invalid Token"});

    const user = await User.findById(decoded.userId).select("-password")
    if(!user) return res.status(400).json({message:"User not found"});

    req.user = user;
    next();
  }catch(err){
    console.log("error in protect route middleware: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}