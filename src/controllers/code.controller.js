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

export const allFiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const total = await codeModel.countDocuments({ userId });

    const files = await codeModel
      .find({ userId })
      .select(['title', 'language', 'createdAt', 'updatedAt'])
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.log("Error in all files controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const fileById = async (req, res) => {
  try {
    const fileName = req.params.FileName;
    const file = await codeModel.findById(fileName); 
    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json(file);
  } catch (err) {
    console.log("Error in file by id controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateById = async (req, res) => {
  try {
    const { fileName } = req.params;
    const { title, language, versionIndex, script } = req.body;

    const file = await codeModel.findOne({ title });
    if (file && file._id.toString() !== fileName) {
      return res.status(400).json({ message: "File Name already exists" });
    }

    const updatedFile = await codeModel.findByIdAndUpdate(
      fileName,
      { language, versionIndex, script, title },
      { new: true }
    );

    if (!updatedFile) return res.status(404).json({ message: "File not found" });

    res.status(200).json(updatedFile);
  } catch (err) {
    console.log("Error in update by id controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteById = async (req, res) => {
  try {
    const codeId = req.params.fileName;

    const deleteExecutions = await executionModel.deleteMany({ codeId });
    if (!deleteExecutions) return res.status(400).json({ message: "File Delete not possible" });

    const deletedFile = await codeModel.findByIdAndDelete(codeId);
    if (!deletedFile) return res.status(400).json({ message: "File Delete not possible" });

    res.status(201).json({ message: "File deleted successfully", deletedFile });
  } catch (err) {
    console.log("Error in delete by id controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserCodeStats = async (userId) => {
  const files = await codeModel.find({ userId }).select(['language']);
  
  const codeStats = {};
  
  for (const file of files) {
    const lang = file.language.toLowerCase();
    codeStats[lang] = (codeStats[lang] || 0) + 1;
  }

  return {
    total: files.length,
    codeStats,
  };
};
