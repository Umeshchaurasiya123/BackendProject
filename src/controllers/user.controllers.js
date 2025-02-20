import { asyncHandler } from "../utils/asynchHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

import {uploadOnCloudinary} from "../utils/cloudinary.js"

import { ApiResponce } from "../utils/ApiResponce.js";


const registerUser=asyncHandler(async (req,res)=>{

    

    const {fullName,email,username,password}=req.body
    console.log("email: ",email)
    console.log("password: ",password)

    // if (fullName===""){
    //     throw new ApiError(400,"fullname is required")
    // }

    if(
        [fullName,email,username,password].some((field)=>{
            
          if( field===undefined || field===null || field.toString().trim()==="")
          {
            return true
          }
          
              
        })
    ) 
    {
        throw new ApiError(400,"All fields are is required")
        
    }

    // check if user id alredy exists or not. 
    // based on email or name


    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    console.log(req.files)

    const avatarLocalPath=req.files?.avatar[0]?.path; 
    console.log(avatarLocalPath)
    
    // const coverImageLocalPath=req.files?.coverImage[0]?.path
    // console.log(coverImageLocalPath)

    // getting the error in optinal channing. 
    // trying  to read coverImage which is undefiend its fist  value. 
    // i.e can not read properties of undefiend 

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0 ){
         coverImageLocalPath=req.files.coverImage[0].path
    }


    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    console.log(coverImage)
    
    if (!avatar){
        throw new ApiError(400,"Avatar file is requireds")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()

    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500, "something went wrong while registering a user")
    }


    return res.status(201).json( 
        new ApiResponce(201,createdUser,"User registerd succesfully")
    )



    
    // res.status(200).json({
    //     message:"ok"
    // })


})

export {registerUser}




