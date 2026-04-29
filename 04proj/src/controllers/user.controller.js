import { asyncHandler } from "../utility/asynchandler.js";
import ApiError from "../utility/apiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import ApiResponse from "../utility/apiResponse.js";


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

const registerUser = asyncHandler(async (req, res) => {

  const { fullname, email, username, password } = req.body
  console.log("--- REGISTER DEBUG ---")
  console.log("req.body:", req.body)
  console.log("req.files:", req.files)

  // return res.status(200).json({
  //   message:"User registered successfully"
  // })

  if (email === "") {
    throw new ApiError(400, "Email is required")
  }
  // to check more errors at one go
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) throw new ApiError(400, "All fields are required")

  const existedUser = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existedUser) {
    throw new ApiError(400, "User already exists")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  console.log("avatarLocalPath:", avatarLocalPath)
  const coverLocalPath = req.files?.coverImage?.[0]?.path
  console.log("coverLocalPath:", coverLocalPath)

  if (!avatarLocalPath)
    throw new ApiError(400, "avatar is required")

  const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
  console.log("avatarUrl response:", avatarUrl)
  const coverImageUrl = await uploadOnCloudinary(coverLocalPath)
  console.log("coverImageUrl response:", coverImageUrl)


  //check url exists or not if not throw error
  if (!avatarUrl)
    throw new ApiError(400, "Something went wrong while uploading avatar")

  const user = await User.create({
    fullname,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || "",
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"   //use(- minus)to exclude password
  )

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while creating user")

  return res.status(200).json(new ApiResponse(
    200,
    createdUser,
    "User registered successfully",
  ))

})

export { registerUser }