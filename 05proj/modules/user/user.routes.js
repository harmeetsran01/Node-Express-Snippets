import { Router } from "express";
import { loginUser } from "./user.controller.js";

const userRouter = Router()

userRouter.route('/').get(loginUser)


export default userRouter