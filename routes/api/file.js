const route = require('express').Router();

const File = require('../../models/File');
const Folder = require('../../models/Folder');

const path = require('path');


const multer = require ('multer');  

const auth = require('../../middleware/auth');

const storageEngine = multer.diskStorage ({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
      callback (
        null,
        file.fieldname + '-' + Date.now () + path.extname (file.originalname)
      );
    },
  });
  
  
  
  const upload = multer ({
    storage: storageEngine,
  });



route.get('/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id;
        if(id=="" || id==null){
            res.status(401).json({error:true,message:'error retrieving file'});
        }
        const file = await File.find({user:req.user.id,_id:id})
        return res.status(200).json(file);
    }
    catch(err){
        res.status(401).json({error:true,message:'error retrieving file'});
    }
})

route.post("/", auth,  upload.single ('uploadedFile'),   async(req,res)=>{
    try{
        const {parentId,name} = req.body;
        console.log(parentId);
        let parentfolder = null;
        if(parentId!=null){
            parentfolder = await Folder.findOne({_id:parentId});
            if(parentfolder==null){
                return res.status(401).json({error:true,message:'error creating new file'});        
            }
        }

        const newFile = new File({
            name:name,
            user:req.user.id
        })

        const createdFile = await newFile.save();
        return res.status(200).json(createdFile);
    }
    catch(err){
        console.log(err);
        res.status(401).json({error:true,message:'error creating new file'});
    }
})

route.put('/',auth,async(req,res)=>{
    try{
        const currId = req.body.id;
        const updatedName = req.body.updatedName;
        if(currId && updatedName){
            const currFile = await File.findOneAndUpdate({_id:currId,user:req.user.id},{name:updatedName})
            if(currFile){
                return res.status(200).json({error:false,message:'Successfully Updated'});
            }
            return res.status(404).json({error:true,message:'no File found'})
        }

        return res.status(404).json({error:true,message:'required parameters missing'})
    }
    catch(err){
        return res.status(404).json({error:true,message:'Error updating File name'})
    }
})

route.delete('/',auth,async(req,res)=>{
    try{
        const currId=req.body.id;
        console.log(currId);
        const deletedCurrFile = await File.deleteOne({_id:currId,user:req.user.id});
        if(deletedCurrFile.ok===0){
            return res.status(404).json({error:true,message:"cannot delete current file"});
        }
        
        return res.status(202).json({error:false,message:"Successfully deleted"})
    }
    catch(err){
        console.log(err);
        res.status(404).json({error:true,message:"No file found to delete"});
    }
})

module.exports = route;