import mongoose from "mongoose"

const codeSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, unique: true },
  language: { type: String, required: true },
  versionIndex:{type: String, required: true},
  script: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Code",codeSchema);
