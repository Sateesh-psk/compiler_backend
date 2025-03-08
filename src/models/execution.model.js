import mongoose from "mongoose"

const ExecutionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  codeId: { type: mongoose.Schema.Types.ObjectId, ref: "Code", required: true },
  stdin: { type: String },
  output: { type: String },
  status: { type: String, enum: ["success", "error"], required: true },
  error: { type: String }, 
  cpuTime: { type: Number }, 
  memory: { type: Number },
  executedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Execution", ExecutionSchema);