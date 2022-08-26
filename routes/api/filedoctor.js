const route = require('express').Router();

const FileDoctor = require('../../models/FileDoctor');
const FolderDoctor = require('../../models/FolderDoctor');




const authdoctor = require('../../middleware/authdoctor');



route.get('/:id',authdoctor,async(req,res)=>{
    try{
        const id = req.params.id;
        if(id=="" || id==null){
            res.status(401).json({error:true,message:'error retrieving file'});
        }
        const filedoctor = await FileDoctor.find({doctor:req.doctor.id,_id:id})
        return res.status(200).json(filedoctor);
    }
    catch(err){
        res.status(401).json({error:true,message:'error retrieving file'});
    }
})

route.post("/",authdoctor,  async(req,res)=>{
    try{
        const {parentIddoctor,namedoctor,filetypedoctor,extensiondoctor,contentdoctor} = req.body;
        console.log(parentIddoctor);
        let parentfolderdoctor = null;
        if(parentId!=null){
            parentfolderdoctor = await FolderDoctor.findOne({_id:parentIddoctor});
            if(parentfolderdoctor==null){
                return res.status(401).json({error:true,message:'error creating new file'});        
            }
        }

        const newFile = new FileDoctor({
            namedoctor:namedoctor,
            filetypedoctor:filetypedoctor,
            extensiondoctor:extensiondoctor,
            contentdoctor:contentdoctor,
            parentfolderdoctor:parentfolderdoctor,
            doctor:req.doctor.id
        })

        const createdFile = await newFile.save();
        return res.status(200).json(createdFile);
    }
    catch(err){
        console.log(err);
        res.status(401).json({error:true,message:'error creating new file'});
    }
})

route.put('/',authdoctor,async(req,res)=>{
    try{
        const currIddoctor = req.body.id;
        const updatedNamedoctor = req.body.updatedNamedoctor;
        if(currIddoctor && updatedNamedoctor){
            const currFiledoctor = await FileDoctor.findOneAndUpdate({_id:currIddoctor,doctor:req.doctor.id},{name:updatedNamedoctor})
            if(currFiledoctor){
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

route.delete('/',authdoctor,async(req,res)=>{
    try{
        const currIddoctor=req.body.id;
        console.log(currIddoctor);
        const deletedCurrFiledoctor = await FileDoctor.deleteOne({_id:currIddoctor,doctor:req.doctor.id});
        if(deletedCurrFiledoctor.ok===0){
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