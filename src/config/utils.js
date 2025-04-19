import jwt from "jsonwebtoken"
import { JDoodleConfig } from "../config/jdoodle.js";

export const generateToken = (userId,res)=>{
  const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, { expiresIn: "7d",});

  res.cookie("jwt",token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV !== "development",
  })
  
  return token;
}

export const executeCode = async (script, stdin, language, versionIndex) => {
  const payload = {
    clientId: JDoodleConfig.clientId,
    clientSecret: JDoodleConfig.clientSecret,
    script,
    stdin,
    language,
    versionIndex,
    compileOnly: false,
  };

  try {
    const response = await fetch(JDoodleConfig.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    console.error("Error in JDoodle API call:", error);
    throw new Error("Failed to execute code");
  }
};
