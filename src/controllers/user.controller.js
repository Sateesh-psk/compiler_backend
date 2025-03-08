import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../config/utils.js";

export const singup = async (req,res) => {
  const {email, fullName, password} = req.body;
  try{
    const user = await User.findOne({email});

    if(user) return res.status(400).json({message:"User already exists"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      email,
      fullName,
      password:hashedPassword,
    })

    if(newUser){
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id:newUser._id,
        fullName: newUser.fullName,
        email:newUser.email,

      });
    }else{
      res.status(400).json({message:"Invalid user data"});
    }
  }catch(err){
    console.log("Error in signup controller: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}

export const login = async (req,res) => {
  const {email,password} = req.body;
  try{
    const user = await User.findOne({email});

    if(!user) return res.status(400).json({message:"Invalid User credentials"});

    const isPosswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPosswordCorrect) return res.status(400).json({message:"Invalid User credentials"});

    generateToken(user._id,res);

    res.status(201).json({
      _id:user._id,
      email:user.email,
      fullName:user.fullName,
    })
  }catch(err){
    console.log("Error in login controller: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}

export const logout = async (req,res) => {
  try{
    res.cookie("jwt","",{maxAge:0});
    res.status(201).json({message:"Logged out succesfully"});

  }catch(err){
    console.log("Error in logout controller: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}

export const userDetails = (req,res) => {
  try{
    res.status(201).json(req.user);
  }catch(err){
    console.log("error in user details controller: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}

export const updateProfile = async (req,res) => {
  try{
    const userId = req.user._id;
    
    const updatedUser = await User.findByIdAndUpdate(userId,
      {fullName: req.body.fullName},
      {new : true}
    ).select('-password')

    res.status(201).json(updatedUser);
  }catch(err){
    console.log("error in update profile controller: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}