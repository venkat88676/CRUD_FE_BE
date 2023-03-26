const express=require("express");
const cors=require("cors")
const {connection} = require("./db");
const {userRouter}=require('./routers/userRouter')
const {authenticate}=require('./middleware/authenticate')
const {noteRoute}=require('./routers/noteRouter')
require("dotenv").config()
const app=express();
app.use(cors())
app.use(express.json());


app.use('/users',userRouter);
app.use(authenticate)
app.use('/notes',noteRoute)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(`server running at ${process.env.port}`)
    }catch(err){
        console.log(err)
    }
})
