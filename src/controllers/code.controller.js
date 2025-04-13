import codeModel from "../models/code.model.js";
import executionModel from "../models/execution.model.js";

export const saveFile = async (req,res) => {
  const {title, language, script, versionIndex} = req.body;
  try{
    const userId = req.user._id;
    const file = await codeModel.findOne({userId,title});

    if(file) return res.status(400).json({message:"File name already exists"});

    const newCodeFile = new codeModel({
      userId,
      title,
      language,
      versionIndex,
      script
    })
    
    if(newCodeFile){
      await newCodeFile.save();
      res.status(201).json({
        _id:newCodeFile._id,
        title:newCodeFile.title,
        script:newCodeFile.script,
        versionIndex:newCodeFile.versionIndex,
        language:newCodeFile.language,
      })
    }else{
      res.status(400).json({message:"Invalid File Data"})
    }
  }catch(err){
    console.log("Error in save file controller",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}

export const allFiles = async (req,res) => {
  try{
    const userId = req.user._id;
    const files = await codeModel.find({userId}).select(['title','language','createdAt','updatedAt']);
    res.status(201).json(files);
  }catch(err){
    console.log("Error in all files controller",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}

export const fileById = async (req,res) => {
  try {
    const {_id} = req.body;
    const file = await codeModel.findOne({_id});
    res.status(201).json(file);
  }catch(err){
    console.log("Error in file by id controller",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}
export const updateById = async (req,res) => {
  try{
    const {_id,title,language,versionIndex,script} = req.body;
    const file = await codeModel.findOne({title});
    if(file && file._id !=_id) return res.status(400).json({message:"File Name already exists"});
    const updatedFIle = await codeModel.findByIdAndUpdate(_id,
      {language,versionIndex,script,title},
      {new : true}
    );

    res.status(201).json(updatedFIle);
  }catch(err){
    console.log("Error in update by id controller",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}
export const deleteById = async (req,res) => {
  try{
    const codeId = req.body._id;
    const deleteExecutions = await executionModel.deleteMany({codeId});
    if(!deleteExecutions) return res.status(400).json({message:"File Delete not possible"});

    const deletedFile = await codeModel.findByIdAndDelete(codeId);
    if(!deletedFile) return res.status(400).json({message:"File Delete not possible"});

    res.status(201).json({message:"File deleted successfully",deletedFile});
  }catch(err){
    console.log("Error in delete by id controller",err);
    res.status(400).json({message:"Internal Server Error"});
  }
}