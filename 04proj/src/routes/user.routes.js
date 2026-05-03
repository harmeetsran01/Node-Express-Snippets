import { Router } from "express";
import { registerUser,login,logout, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router()

// router.route("/register").post(
//  registerUser   
// )

// handling files using multer
//executing middleware here
router.route("/register").post(
    upload.fields([
        {name:"avatar",maxCount:1},
        {name:"coverImage",maxCount:1}
    ]),
    registerUser)

router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/refresh-access-token").post(refreshAccessToken)
export default router