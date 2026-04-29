import { asyncHandler } from "../utility/asynchandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utility/apiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token) throw new ApiError(401, "Unauthorized request")

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user) throw new ApiError(401, "Invalid access token");
    req.user = user;
    next();
    }
    catch(error){
        console.error(error || error.message);
        throw new ApiError(500, "Something went wrong while verifying JWT: " + error?.message);
    }
})