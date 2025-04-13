import mongoose from "mongoose"

const codeSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, unique: true },
  language: { type: String, required: true },
  versionIndex:{type: String},
  script: { type: String, required: true }
},{
  timestamps: true
});

export default mongoose.model("Code",codeSchema);
