import dotenv from "dotenv";
dotenv.config();

export const JDoodleConfig = {
  clientId: process.env.JDOODLE_ID,
  clientSecret: process.env.JDOODLE_SECRET,
  apiUrl: "https://api.jdoodle.com/v1/execute",
};
