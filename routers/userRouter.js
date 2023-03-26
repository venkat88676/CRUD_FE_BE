const express=require("express")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const {UserModel}=require('../model/usermodel')
const userRouter=express.Router();


const {authenticate}=require("../middleware/authenticate")


userRouter.get('/',async(req,res)=>{
    try{
        const users= await UserModel.find()
        res.status(200).send(users)
    }catch(err){
        res.status(400).send({msg:err.message})
    }
})

userRouter.post('/login',async(req,res)=>{
    try{
        const {email,pass}=req.body;
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    let token=jwt.sign({userId:user._id},'masai')
                    res.status(200).send({"msg":"Login Successfully","token":token})
                }
                else res.send({"msg":"Wrong credentials"})
            })
        } 
        else{
            res.send("Register First")
        }
    }catch(err){
        res.status(400).send({msg:err.message})
    }
})

userRouter.post('/register',async(req,res)=>{
    try{
        const {name,email,pass,age}=req.body;
        bcrypt.hash(pass,5,async(err,hash)=>{   
                if(err){
                    res.send({"msg":err.message})
                }  
                else{
                    const user= new UserModel({name,email,pass:hash,age})
                    await user.save();
                    res.status(200).send({msg:"Registered Successfully"})       
                }    
        })    
    }catch(err){
        res.status(400).send({msg:err.message})
    }
})

module.exports={userRouter}