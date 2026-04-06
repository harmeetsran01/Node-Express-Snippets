import dotenv from "dotenv"
dotenv.config({path: './.env'})
// require('dotenv').config({path:"./env"})
import connectDB from "./db/index.js";
 
// 1. Approach to connect DB
connectDB()
// 2. Approach to connect DB
/*
import express from "express"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error: ",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on PORT: ${process.env.PORT}`)
        })
    }
    catch(e){
        console.error("Error: ",e)
        throw e
    }
})()

*/