import app from "../app.js"
import userRouter from '../modules/user/user.routes.js'


app.use("/api/v1/user",userRouter)

export default app
