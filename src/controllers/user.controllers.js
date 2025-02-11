import { asyncHandler } from "../utils/asynchHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";


const registerUser=asyncHandler(async (req,res)=>{

    

    // const {fullname,email,username,password}=req.body
    // console.log("email: ",email)
    // console.log("password: ",password)

    // // if (fullName===""){
    // //     throw new ApiError(400,"fullname is required")
    // // }

    // if(
    //     [fullname,email,username,password].some((field)=>{
    //         field?.trim()===""
    //     })
    // ) 
    // {
    //     throw new ApiError(400,"fullname is required")


    // }

    // // check if user id alredy exists or not. 
    // // based on email or name


    // const existedUser= await User.findOne({
    //     $or:[{username},{email}]
    // })

    // if(existedUser){
    //     throw new ApiError(409,"User with email or username already exist")
    // }

    // const avatarLocalPath=req.files?.avatar[0]?path; 
    

    
    res.status(200).json({
        message:"ok"
    })





})

export {registerUser}




