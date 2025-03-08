import codeModel from "../models/code.model.js";
import executionModel from "../models/execution.model.js";
import { executeCode } from "../config/utils.js";

export const runCode = async (req, res) => {
  try {
    const { script, stdin, language, versionIndex } = req.body;
    const compiled = await executeCode(script, stdin, language, versionIndex);

    res.status(201).json(compiled);
  } catch (err) {
    console.error("Error in runCode:", err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

export const SaveExecution = async (req, res) => {
  try {
    const { codeId, stdin } = req.body;
    const userId = req.user._id;

    const codeFile = await codeModel.findById(codeId);
    if (!codeFile) return res.status(404).json({ message: "Code file not found" });

    const { script, versionIndex, language } = codeFile;
    const compiled = await executeCode(script, stdin, language, versionIndex);

    const { output, error, cpuTime, memory } = compiled;
    const status = error ? "error" : "success";
    
    const userDocumentCount = await executionModel.countDocuments({ userId });
    if (userDocumentCount >= 15) {
      await executionModel.findOneAndDelete({ userId }, { sort: { createdAt: 1 } });
    }
    const newExecution = new executionModel({
      userId,
      codeId,
      stdin,
      output,
      status,
      error,
      cpuTime,
      memory,
    });

    await newExecution.save();
    res.status(201).json(newExecution);
  } catch (err) {
    console.error("Error in SaveExecution:", err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

export const History = async (req,res) => {
  const userId = req.user._id;
  try{
    const executionHistory = await executionModel.find({userId}).sort({createdAt : -1});
    res.status(201).json(executionHistory);
  }catch(err) {
    console.error("Error in History:", err);
    res.status(400).json({ message: "Internal Server Error" });
  }
}