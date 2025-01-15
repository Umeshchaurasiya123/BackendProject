import {Router} from 'express';

import {registerUser} from "../controllers/user.controllers.js";

const router =Router()

import {upload}  from "../middlewares/multer.middleware.js";


router.route("/register").post(
    upload.fields([
         {
                name:"avatar",
         },     maxCount:1
         {
                name:"coverImage",
                maxCount:1
         }
    ]),
    registerUser)

// router.route("/login").post(loginUser)


export default router
