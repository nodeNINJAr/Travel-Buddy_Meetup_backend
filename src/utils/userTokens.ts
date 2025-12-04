import { JwtPayload } from "jsonwebtoken";
import {StatusCodes} from "http-status-codes"
import AppError from "../app/middlewares/appError.js";
import { generateToken, verifyToken } from "./jwt.js";
import { prisma } from "../lib/prisma.js";
import config from "../config/index.js";
import { VUser } from "../type/index.js";
import { UserStatus } from "../generated/prisma/enums.js";





// ** create user token
export const createUserTokens = async(user : Partial<VUser>)=>{
     // 
     const jwtPayload = {
         userId:user.id,
         email:user.email,
         role:user.role,
         emailVerified:user.emailVerified,
         activeStatus:user.activeStatus
     }
     
     // 
     const accessToken = generateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires);
     const refreshToken = generateToken(jwtPayload,config.jwt_refresh_secret, config.jwt_refresh_expire);

    return {
        accessToken,
        refreshToken,
    }
}



// ** genarate access token by refresh token
export const createNewAccessTokenByRefreshToken= async(refreshToken: string)=>{
   
 const verifiedRefreshToken = verifyToken(refreshToken, config.jwt_refresh_secret) as JwtPayload;

    //
  const isUserExist = await prisma.user.findFirst({
       where:{
          email:verifiedRefreshToken.email
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


  // 
const jwtPayload = {
    userId:isUserExist.id,
    email:isUserExist.email,
    role:isUserExist.role,
    emailVerifed:isUserExist.emailVerified,
    activeStatus:isUserExist.activeStatus,
}

// 
const accessToken = generateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires);


// 
return accessToken


}