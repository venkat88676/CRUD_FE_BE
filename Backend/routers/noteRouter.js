const express=require("express")
const {NoteModel}=require('../model/noteModel')
const noteRoute=express.Router()
const jwt=require("jsonwebtoken")

noteRoute.get('/',async(req,res)=>{
    const token=req.headers.authorization
    jwt.verify(token,'masai',async(err,decoded)=>{
        if(decoded){
            let userId=decoded.userId
            let notes= await NoteModel.find({userId})
            res.send(notes)
        }
        else{
            res.send({"msg":"Please Login"})
        }
    })
    
})

noteRoute.post('/create',async(req,res)=>{
    const payload=req.body
    const note=new NoteModel(payload)
    try{
        await note.save()
         res.send({"msg":"New Note Created"})
    }catch(err){
        res.send({"msg":err.message})
    }    
})

noteRoute.patch('/update/:id',async(req,res)=>{
    const noteId=req.params.id
    const payload=req.body;
    try{
        await NoteModel.findByIdAndUpdate({_id:noteId},payload)
         res.status(200).send({"msg":`Note with id:${noteId} has updated`})
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
    
})

noteRoute.delete('/delete/:id',async(req,res)=>{
    const noteId=req.params.id
    try{
        await NoteModel.findByIdAndDelete({_id:noteId})
        res.send({"msg":`Note with id:${noteId} has Deleted`})
    }
    catch(err){
        res.send(err)
    }
    
})

module.exports={noteRoute}