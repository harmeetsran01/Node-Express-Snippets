import { asyncHandler } from "../utility/asynchandler.js";
import { ApiError } from "../utility/ApiError.js";
import {User} from "../models/user.models.js"

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
})

export {registerUser}