import dotenv from "dotenv"
import app from "./routes/routes.js"

dotenv.config({
  path:'./.env'  
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`) 
       
})
