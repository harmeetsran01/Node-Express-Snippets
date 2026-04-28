import { asyncHandler } from "../utility/asynchandler.js";
import { ApiError } from "../utility/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary } from "../utility/cloudinary.js";
import { ApiResponse } from "../utility/ApiResponse.js";


/** 
 * Validation
 * get user details
 * validation not empty
 * check if user already exists: username, email
 * check avatar, images.
 * upload to cloudnary
 * create user in db
 * store user details in db
 * remove password and token from response
 * response 
 * 
 * User detail from frontend:
 * req.body: request from body, json or form {fullname,email,username,password}
 * req.files: request from files []
 */
const registerUser = asyncHandler(async (req,res)=>{

  const {email} = req.body
  console.log(email)
  
  // return res.status(200).json({
  //   message:"User registered successfully"
  // })

  if(email ===""){
    throw new ApiError(400,"Email is required")
  }
  // to check more errors at one go
  if(
    [fullname,email,username,password].some((field)=>field?.trim() === "")
  ) throw new ApiError(400,"All fields are required")

  const existedUser = User.findOne({
    $or:[{email},{username}]
  })
  
  if(existedUser){
    throw new ApiError(400,"User already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverLocalPath = req.files?.coverImage[0]?.path

  if(!avatarLocalPath)
    throw new ApiError(400,"avatar is required")

  const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
  const coverImageUrl = await uploadOnCloudinary(coverLocalPath)
  

  //check url exists or not if not throw error
  if(!avatarUrl || !coverImageUrl)
    throw new ApiError(400,"Something went wrong while uploading")
    
const user = await User.create({
  fullname,
  email:email.toLowerCase(),
  username:username.toLowerCase(),
  password,
  avatar: avatarUrl.url,
  coverImage: coverImageUrl?.url || "",
})

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"   //use(- minus)to exclude password
)

if(!createdUser)
  throw new ApiError(500,"Something went wrong while creating user")

return res.status(200).json(new ApiResponse(
  200,
  createdUser,
  "User registered successfully",
))

})

export {registerUser}