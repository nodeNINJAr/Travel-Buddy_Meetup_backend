import { NextFunction, Request, Response } from "express";
import AppError from "./appError.js";
import { verifyToken } from "../../utils/jwt.js";
import config from "../../config/index.js";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { StatusCodes } from "http-status-codes";
import { UserStatus } from "../../generated/prisma/enums.js";


export const checkVerifiedUser = (...authRoles:string[])=>(async(req:Request, res:Response, next:NextFunction)=>{
    
    try {
         const accessToken = req.cookies.accessToken;
          if(!accessToken){
        throw new AppError(StatusCodes.FORBIDDEN, "No Token Found")
      }

      const verifiedToken = verifyToken(accessToken, config.jwt_access_secret) as JwtPayload;

       const isUserExist = await prisma.user.findUnique({
         where:{
            email:verifiedToken.email
         }
       });
        //   
        if(!isUserExist){
            throw new AppError(StatusCodes.BAD_REQUEST, "Email Does Not exist")
        }  
         //  
        if(isUserExist.activeStatus === UserStatus.BLOCKED){
         throw new AppError(StatusCodes.BAD_REQUEST, `user is ${isUserExist.activeStatus}`)
        }  

        // if(!isUserExist.emailVerified){
        //   throw new AppError(StatusCodes.FORBIDDEN, "User email is not verified");
        // }

         // if role is no right
        if(authRoles.length && !authRoles.includes(verifiedToken.role)){
            throw new AppError(StatusCodes.FORBIDDEN, "Role not permitted to access this route")
        }
          // 
        req.user = verifiedToken;


        // 
        next();
       //   
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("jwt error", error);
        next(error) 
    }


})
