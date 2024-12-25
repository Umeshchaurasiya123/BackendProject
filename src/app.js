// express is an framework which provide the capability of hadling request and responce. 

import express from "express"
import cors from "cors"
import cookieParser from "cookies-parser" 


const app=express()

// our app is create thought the express. 
// now as we imported the cors and cookies-parser.
// we also have to configure them also. 

// for that we use app.use

app.use(cors({

    origin:process.env.CORS_ORIGIN,
    credentials:true

}        
))

// configuring the app to get the data in json form client
// basically it is an body-paser which  is now part of express by default. 
// earlier have to import them throuh the npm. 
// also there is an multer to  work with file upload done by used. 
// to handle file upload multer is used 

// getting the data from the form 

app.use(express.json({limit:"16kb"}))


// to get the data from the URl 
// 
app.use(express.urlencoded({extended:true,limit:"16kb"}))

// to store the something in our server which is kind of static. like public asseset. 
// it is an build in middleware function  whicbh servr the static files and based on server static. 
// here public represet the  my public folder in project

app.use(express.static("public"))

//cookies parser is an packes which help in storing and reading cokies form server to user broser. basically crud operation  performed 
// server on user browser
app.use(cookieParser())

export {app}


