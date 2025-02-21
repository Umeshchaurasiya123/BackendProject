import { asyncHandler } from "../utils/asynchHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

import {uploadOnCloudinary} from "../utils/cloudinary.js"

import { ApiResponce } from "../utils/ApiResponce.js";


const generateAccessAndRefershTokens= async(userId)=>{

    try{

        const user=await User.findById(userId)
        const accessToken= user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken

        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    }
    catch(error){

        throw new ApiError(500,"something went wrong while generating refresh and access token")
    }


}

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


const loginUser=asyncHandler(async(req,res)=>{
     
    const {email,username,password}=req.body

    if(!username || !email){
        throw new ApiError(400,"username or email is required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }


    // creating access and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefershTokens(user._id)

    
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")


    // setting the cookies to client browse
    // to send access and refresh token 

    //By default cookies are modifiable by the client.  
    // httpOnly prevent that. 
    // only the server can modify this cookie  

    const options={

        httpOnly:true,
        secure:true
    }

    // setting the cookies to client browse
    // to send access and refresh token 
    return res.status(200)
    .cookies("accessToken",accessToken,options)
    .cookies("refreshToken",refreshToken,options)
    .json(
        new ApiResponce(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            
            "user logged in Successfully"
        )
    )

 
})


export {registerUser,loginUser}




