import passport from "passport";
import {StatusCodes} from 'http-status-codes'
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import sendResponse from "../../shared/sendResponse.js";
import AppError from "../../middlewares/appError.js";
import catchAsync from "../../shared/catchAsync.js";
import { setAuthCookies } from "../../../utils/setCookies.js";
import { createUserTokens } from "../../../utils/userTokens.js";
import { AuthServices } from "./auth.services.js";






// 
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     //    
      passport.authenticate("local", async (err: any, user: any, info: any) => {
       //    
        if (err) {
            console.log("from err", err);
            return next(new AppError(401, err))
        }

        if (!user) {
           
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)
        // 
        const { password: pass, ...rest } = user

        setAuthCookies(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)

})

//  
const getNewAccessTokens = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
    // 
    const refreshToken = req.cookies.refreshToken;
    
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);
     
    setAuthCookies(res, tokenInfo)
    //    
    sendResponse(res, {
    success:true, 
    statusCode:StatusCodes.OK,
    message:"New Token Genarated Successfully",
    data:tokenInfo,
    })


})


const userLogOut = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{

    res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax",
    })  
    // 
   res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
   })
    //    
    sendResponse(res, {
    success:true, 
    statusCode:StatusCodes.OK,
    message:"User Logged Out Successfully",
    data:null,
    })


})

// ** reset password
const resetPassword = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
    // 
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    // 
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
    //    
    sendResponse(res, {
    success:true, 
    statusCode:StatusCodes.OK,
    message:"Password reset Successfully",
    data:null,
    })


})




// 

export const AuthControllers = {
      credentialsLogin,
      getNewAccessTokens,
      userLogOut,
      resetPassword,
}