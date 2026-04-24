import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// app.use is for middleware, cors, cookie-parser, express.json, express.urlencoded
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
// accepting json to a limit, for security purposes

app.use(express.urlencoded({extended:true,limit:"16kb"}))
// url has its own encoder, we use extended true to allow nested objects
// accepting url encoded data to a limit, for security purposes

app.use(express.static("public"))
// serving static files which will be placed under public foler, such as assests, favicon, public etc

app.use(cookieParser())
// parsing cookies


//  app.get is not only having (res,req): it is having (err,req,res,next)
//  next (is a flag) is used to call the next middleware



//Routes import
import userRouter from './routes/user.routes.js'

// Routes declaration
app.use("/api/v1/users", userRouter)

export default app
