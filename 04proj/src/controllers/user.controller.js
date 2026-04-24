import { asyncHandler } from "../utility/asynchandler.js";

const registerUser = asyncHandler(async (req,res)=>{
  return res.status(200).json({
    message:"User registered successfully"
  })
})

export {registerUser}