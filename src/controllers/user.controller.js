import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import { generateToken } from "../config/utils.js";
import { google } from "googleapis";
import { getUserCodeStats } from './code.controller.js';


const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

export const initiateSignup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    console.log("OAuth creds:", {
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      email: process.env.EMAIL_FROM
    });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = jwt.sign(
      { email, fullName, password: hashedPassword },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const link = `${process.env.REDIRECT_FRONTEND_LINK}/verify-email/${token}`;

    // ✨ Get access token from refresh token
    const accessToken = await oauth2Client.getAccessToken();
    console.log("accessToken: ",accessToken.token);
    // ✅ Gmail OAuth2 Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_FROM,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    console.log(" nodemailer transporter is created");
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email",
      html: `<p>Hello ${fullName},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${link}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.log("Error in initiateSignup:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyAndCreateUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, fullName, password } = decoded;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, fullName, password });
    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (err) {
    console.log("Error in verifyAndCreateUser:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


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

export const userDetails = async (req, res) => {
  try {
    const user = req.user;

    const { total, codeStats } = await getUserCodeStats(user._id);

    res.status(200).json({
      ...user.toObject(),
      codeCount: total,
      codeStats
    });
  } catch (err) {
    console.error("Error in user details controller:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req,res) => {
  try{
    const userId = req.user._id;
    
    const { total, codeStats } = await getUserCodeStats(userId);
    
    const updatedUser = await User.findByIdAndUpdate(userId,
      {fullName: req.body.fullName},
      {new : true}
    ).select('-password')

    res.status(200).json({
      ...updatedUser.toObject(),
      codeCount: total,
      codeStats
    });
  }catch(err){
    console.log("error in update profile controller: ",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}
// export const singup = async (req,res) => {
//   const {email, fullName, password} = req.body;
//   try{
//     const user = await User.findOne({email});

//     if(user) return res.status(400).json({message:"User already exists"});

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password,salt);

//     const newUser = new User({
//       email,
//       fullName,
//       password:hashedPassword,
//     })

//     if(newUser){
//       generateToken(newUser._id, res);
//       await newUser.save();

//       res.status(201).json({
//         _id:newUser._id,
//         fullName: newUser.fullName,
//         email:newUser.email,

//       });
//     }else{
//       res.status(400).json({message:"Invalid user data"});
//     }
//   }catch(err){
//     console.log("Error in signup controller: ",err);
//     res.status(400).json({message:"Internal Server Error"});
//   }
// }
