import { Router } from "express";
import { 
    registerUser,
    login,
    logout, 
    refreshAccessToken, 
    changePassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory} from "../controllers/user.controller.js";
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

//Files End points 
router.route("/update-user-avatar").post(
verifyJWT,
upload.single("avatar"),
updateUserAvatar)

router.route("/update-cover-image").post(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage)


//End points
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/update-account").post(verifyJWT,updateAccountDetails)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)


router.route("/refresh-access-token").post(refreshAccessToken)
export default router
