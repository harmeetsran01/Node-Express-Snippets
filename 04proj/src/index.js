import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from './app.js'   // importing app from app.js

// config
dotenv.config({ path: './.env' })
connectDB()

app.listen(process.env.PORT,()=>{
    try{
    console.log(`Server is running on port ${process.env.PORT}`)
    }
    catch(e){
        console.log("Error on server ",e)
    }
})
