const route = require('express').Router();

const File = require('../../models/File');
const Folder = require('../../models/Folder');

const auth = require('../../middleware/auth');

route.get('/', auth, async (req,res)=>{
    try{
      
        const folders = await Folder
                            .find({user:req.user.id,parentfolder:null})
        const files = await File.find({user:req.user.id,parentfolder:null})
        return res.status(200).json({folders,files});
    }
    catch(err){
        res.status(401).json({error:true,message:'error retrieving folders'});

    }
})

route.get('/:parentId',auth, async (req,res)=>{
    try{
        const parentId = req.params.parentId;
        const folders = await Folder.find({user:req.user.id,parentfolder:parentId})
                                    .populate({
                                        path : 'parentfolder',
                                        populate : {
                                          path : 'parentfolder'
                                        }
                                      })

        const files = await File.find({user:req.user.id,parentfolder:parentId})
        return res.status(200).json({folders,files});
    }
    catch(err){
        res.status(401).json({error:'error retrieving folders for this parent folder'});
    }
})

route.post('/',auth,async(req,res)=>{
    try{
        const parentId = req.body.parentId;
        const folderName = req.body.name;
        const now = Date.now();

        let parentfolder = null;
        if(parentId!=null){
            parentfolder = await Folder.findOne({user:req.user.id,_id:parentId});
            if(parentfolder==null){
                return res.status(401).json({error:true,message:'error creating new folder'});        
            }
        }
            
        const newFolder = new Folder({
            name:folderName,
            createddate:now,
            parentfolder:parentfolder,
            user:req.user.id
        })

        const createdFolder = await newFolder.save();
        return res.status(200).json(createdFolder);
    }
    catch(err){
        console.log(err);
        res.status(401).json({error:true,message:'error creating new folder'});
    }
})

route.put('/',auth,async(req,res)=>{
    try{
        const currId = req.body.id;
        const updatedName = req.body.updatedName;

        if(currId && updatedName){
            const currFolder = await Folder.findOneAndUpdate({_id:currId,user:req.user.id},{name:updatedName})
            if(currFolder){
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

route.delete('/',auth,async(req,res)=>{
    try{
        const currId=req.body.id;
        let foldersToBeDeleted = [];
        let filesToBeDeleted = [];
        
        let currFolder = await Folder.findOne({_id:currId,user:req.user.id});
        if(!currFolder)
            return res.status(404).json({error:true,message:"no folder to delete"});
            
            while((currFolder && !Array.isArray(currFolder)) || (Array.isArray(currFolder) && currFolder.length!=0)){
                let children=[];
                if(Array.isArray(currFolder)){
                    for(let i=0;i<currFolder.length;i++){
                        let parent = currFolder[i];
                        foldersToBeDeleted.push(parent._id);
                        let fetched = await Folder.find({parentfolder:parent._id,user:req.user.id});
                        fetched!=null?children.push(...fetched):0;

                        let fetchedFiles = await File.find({parentfolder:parent._id,user:req.user.id});
                        fetchedFiles!=null?filesToBeDeleted.push(...fetchedFiles):0;
                    }
                }   
                else{
                    foldersToBeDeleted.push(currFolder._id);
                    let fetched = await Folder.find({parentfolder:currFolder._id,user:req.user.id});
                    fetched!=null?children.push(...fetched):0;

                    let fetchedFiles = await File.find({parentfolder:currFolder._id,user:req.user.id});
                    fetchedFiles!=null?filesToBeDeleted.push(...fetchedFiles):0;

                }

                currFolder=children;
            }


            for(let i=0;i<foldersToBeDeleted.length;i++){
                let deleted = await Folder.deleteMany({_id:foldersToBeDeleted[i],user:req.user.id});
                if(deleted.ok==0){
                    return res.status(404).json({error:true,message:"cannot delete subfolder and files"});
                }
            }

            
            for(let i=0;i<filesToBeDeleted.length;i++){
                let deleted = await File.deleteMany({_id:filesToBeDeleted[i]._id,user:req.user.id});
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