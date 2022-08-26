const route = require('express').Router();

const FileDoctor = require('../../models/FileDoctor');
const FolderDoctor = require('../../models/FolderDoctor');

const authdoctor = require('../../middleware/authdoctor');

route.get('/', authdoctor, async (req,res)=>{
    try{
      
        const foldersdoctor = await FolderDoctor
                            .find({doctor:req.doctor.id,parentfolderdoctor:null})
        const filesdoctor = await FileDoctor.find({doctor:req.doctodoctorrdoctor.id,parentfolderdoctor:null})
        return res.status(200).json({foldersdoctor,filesdoctor});
    }
    catch(err){
        res.status(401).json({error:true,message:'error retrieving folders'});

    }
})

route.get('/:parentId',authdoctor, async (req,res)=>{
    try{
        const parentIddoctor = req.params.parentIddoctor;
        const foldersdoctor = await FolderDoctor.find({doctor:req.doctor.id,parentfolderdoctor:parentIddoctor})
                                    .populate({
                                        path : 'parentfolderdoctor',
                                        populate : {
                                          path : 'parentfolderdoctor'
                                        }
                                      })

        const filesdoctor = await FileDoctor.find({doctor:req.doctor.id,parentfolderdoctor:parentIddoctor})
        return res.status(200).json({foldersdoctor,filesdoctor});
    }
    catch(err){
        res.status(401).json({error:'error retrieving folders for this parent folder'});
    }
})

route.post('/',authdoctor,async(req,res)=>{
    try{
        const parentIddoctor = req.body.parentIddoctor;
        const folderNamedoctor = req.body.namedoctor;
        const now = Date.now();

        let parentfolderdoctor = null;
        if(parentIddoctor!=null){
            parentfolderdoctor = await FolderDoctor.findOne({doctor:req.doctor.id,_id:parentIddoctor});
            if(parentfolderdoctor==null){
                return res.status(401).json({error:true,message:'error creating new folder'});        
            }
        }
            
        const newFolder = new FolderDoctor({
            namedoctor:folderNamedoctor,
            createddate:now,
            parentfolderdoctor:parentfolderdoctor,
            doctor:req.doctor.id
        })

        const createdFolder = await newFolder.save();
        return res.status(200).json(createdFolder);
    }
    catch(err){
        console.log(err);
        res.status(401).json({error:true,message:'error creating new folder'});
    }
})

route.put('/',authdoctor,async(req,res)=>{
    try{
        const currIddoctor = req.body.id;
        const updatedNamedoctor = req.body.updatedNamedoctor;

        if(currIddoctor && updatedNamedoctor){
            const currFolderdoctor = await FolderDoctor.findOneAndUpdate({_id:currIddoctor,doctor:req.doctor.id},{namedoctor:updatedNamedoctor})
            if(currFolderdoctor){
                return res.status(200).json({error:false,message:'Successfully Updated'});
            }
            return res.status(404).json({error:true,message:'no folder found'})
        }

        return res.status(404).json({error:true,message:'required parameters missing'})
    }
    catch(err){
        return res.status(404).json({error:true,message:'Error updating folder name'})
    }
})

route.delete('/',authdoctor,async(req,res)=>{
    try{
        const currIddoctor=req.body.id;
        let foldersToBeDeleteddoctor = [];
        let filesToBeDeleteddoctor = [];
        
        let currFolderdoctor = await FolderDoctor.findOne({_id:currIddoctor,doctor:req.doctor.id});
        if(!currFolderdoctor)
            return res.status(404).json({error:true,message:"no folder to delete"});
            
            while((currFolderdoctor && !Array.isArray(currFolderdoctor)) || (Array.isArray(currFolderdoctor) && currFolderdoctor.length!=0)){
                let children=[];
                if(Array.isArray(currFolderdoctor)){
                    for(let i=0;i<currFolderdoctor.length;i++){
                        let parentdoctor = currFolderdoctor[i];
                        foldersToBeDeleteddoctor.push(parentdoctor._id);
                        let fetched = await FolderDoctor.find({parentfolderdoctor:parentdoctor._id,doctor:req.doctor.id});
                        fetched!=null?children.push(...fetched):0;

                        let fetchedFiles = await FileDoctor.find({parentfolderdoctor:parentdoctor._id,doctor:req.doctor.id});
                        fetchedFiles!=null?filesToBeDeleted.push(...fetchedFiles):0;
                    }
                }   
                else{
                    foldersToBeDeleted.push(currFolderdoctor._id);
                    let fetched = await FolderDoctor.find({parentfolderdoctor:currFolderdoctor._id,doctor:req.doctor.id});
                    fetched!=null?children.push(...fetched):0;

                    let fetchedFiles = await FileDoctor.find({parentfolderdoctor:currFolderdoctor._id,doctor:req.doctor.id});
                    fetchedFiles!=null?filesToBeDeleted.push(...fetchedFiles):0;

                }

                currFolderdoctor=children;
            }


            for(let i=0;i<foldersToBeDeleteddoctor.length;i++){
                let deleted = await FolderDoctor.deleteMany({_id:foldersToBeDeleteddoctor[i],doctor:req.doctor.id});
                if(deleted.ok==0){
                    return res.status(404).json({error:true,message:"cannot delete subfolder and files"});
                }
            }

            
            for(let i=0;i<filesToBeDeleteddoctor.length;i++){
                let deleted = await FileDoctor.deleteMany({_id:filesToBeDeleteddoctor[i]._id,doctor:req.doctor.id});
                if(deleted.ok==0){
                    return res.status(404).json({error:true,message:"cannot delete subfolder and files"});
                }
            }

            console.log("all files deleted!");

            return res.status(202).json({error:false,message:"Successfully deleted"})
        
    }
    catch(err){
        console.log(err);
        res.status(404).json({error:true,message:"No folder found to delete"});
    }
})


module.exports = route;