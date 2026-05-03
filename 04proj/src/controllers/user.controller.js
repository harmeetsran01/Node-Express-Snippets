import { asyncHandler } from "../utility/asynchandler.js";
import ApiError from "../utility/apiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import ApiResponse from "../utility/apiResponse.js";
import jwt from "jsonwebtoken"


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

// Global Dec
const generateAcessandRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = await user.generateAccessToken()
      // console.log('accessToken generated: ', accessToken)

      const refreshToken = await user.generateRefreshToken()
      user.refreshToken = refreshToken
      // console.log('refreshToken generated: ', refreshToken)

      await user.save({ validateBeforeSave: false }) // this prevent validation process, which increases speed. Validation like trimming and stuff are skipped. It is only safe to skip validations only when we know the data is correct. and here we know the data is correct
      return { accessToken, refreshToken }
    }
    catch (e) { throw new ApiError(500, 'Something went wrong while generating and access tokens') }
  }

// options for cookies, httponly will restruict frontend to edit cookie 
  const options = {
    httpOnly: true,
    secure: true,
    // sameSite: "strict"
  }

  // Global Dec closed



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
  const coverLocalPath = req.files?.coverImage?.[0]?.path

  if (!avatarLocalPath)
    throw new ApiError(400, "avatar is required")

  const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
  console.log("avatarUrl response:", avatarUrl)
  const coverImageUrl = await uploadOnCloudinary(coverLocalPath)
  console.log("coverImageUrl response:", coverImageUrl)


  //check url exists or not if not throw error
  if (!avatarUrl)
    throw new ApiError(400, "Something went wrong while uploading avatar")

  console.log('Creating user');

  const user = await User.create({
    fullname,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || "",
  })
  console.log('Created user');

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"   //use(- minus)to exclude password
  )
  console.log('Password removes ');

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while creating user")

  return res.status(200).json(new ApiResponse(
    200,
    createdUser,
    "User registered successfully",
  ))

})

const login = asyncHandler(async (req, res) => {

  /**
   * Todo's
   * req body -> data
   * username/email base accesss
   * find user
   * password check
   * generate access token
   * generate refresh token
   * send response with cookies
   */

  const { email, username, password } = req.body
  if (!email) throw new ApiError(400, 'Username or email is required')

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) throw new ApiError(404, "User not found")

  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid Password")

  const { accessToken, refreshToken } = await generateAcessandRefreshTokens(user._id)
  const loggedin = await User.findById(user._id).select('-password -refreshToken')

  
  console.log('Setting cookies');
  // console.log('accessToken', accessToken);
  // console.log('refreshToken', refreshToken);
  
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200,
      { user: loggedin },
      "User logged in successfully",
  ))
})

const logout = asyncHandler(async (req,res)=>{
  try{
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: "" } // removes refreshToken field from document
      },
      { returnDocument: after } // return updated document
    )
    const options = {
    httpOnly: true,
    secure: true,
  }

  return res.status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(
    200,
    {},
    "User logged out successfully",
  ))
    
  }
  catch(e){
    console.error(e ||e.message)
    throw new ApiError(500,"Something went wrong while logging out:" + e?.message)
  }
})

const refreshAccessToken = asyncHandler(async(req,res) =>{
  try {
    const user = await User.findById(req.user._id)
  
    if(!user) throw new ApiError(401,"Invalid user")
    
    const userRefreshToken = user.refreshToken
    const decodedRefreshToken =jwt.verify(
  
      userRefreshToken,
      process.env.REFRESH_TOKEN
    )
  
    if(!decodedRefreshToken?._id) throw new ApiError(401,"Invalid user")
    if(decodedRefreshToken?.refreshToken !== user.refreshToken) throw new ApiError(401,"Refresh Token used or Expired")
  
    const {accessToken,refreshToken} = await generateAcessandRefreshTokens(user._id)
    return res.status(200).
    cookie("accessToken",accessToken,options).
    cookie("refreshToken",refreshToken,options).
    json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken
        },
        "Tokens refreshed successfully"
      )
    )
  } catch (error) {
    console.error(e ||e.message)
    throw new ApiError(500,"Something went wrong while refreshing access token: " + error?.message)
  }
})

const changePassword = asyncHandler(async(req,res)=>{
  try {
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user._id)
    if(!user) throw new ApiError(401,"Invalid user")
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect) throw new ApiError(401,"Invalid Password")
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponse(200,"Password changed successfully"))

  } catch (error) {
    console.error(error ||error.message)
    throw new ApiError(500,"Something went wrong while changing password: " + error?.message)
  }
})
export { registerUser, login ,logout , refreshAccessToken }