import mongoose from "mongoose"

const userSchema = mongoose.Schema({
  email:{ type: String, required: true, unique: true },
  fullName:{ type: String, required: true },
  password:{ type: String, required: true },
},{timeStamps: true});

const User = mongoose.model("User",userSchema);
export default User;