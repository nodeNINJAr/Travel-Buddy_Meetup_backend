import { JwtPayload } from "jsonwebtoken"
import {StatusCodes} from "http-status-codes"
import { createNewAccessTokenByRefreshToken } from "../../../utils/userTokens.js";
import { prisma } from "../../../lib/prisma.js";
import { comparePassword, hashPassword } from "../../../utils/hash.utils.js";
import AppError from "../../middlewares/appError.js";






// **
const getNewAccessToken = async(refreshToken:string)=>{
  const newAccessToken = await createNewAccessTokenByRefreshToken(refreshToken)

// 
return {
   accessToken:newAccessToken
}

//  
}

  //** */ reset password
 const resetPassword = async(oldPassword:string, newPassword:string, decodedToken:JwtPayload)=>{

   // 
   const user = await prisma.user.findUnique(decodedToken.userId)
   //
   const isOldPasswordMatched = await comparePassword(oldPassword, user?.passwordHash as string)
  // 
   if(!isOldPasswordMatched){
      throw new AppError(StatusCodes.FORBIDDEN, "Old password does not match")
   };
   // 
   const passwordHash   = await hashPassword(newPassword)
   await prisma.user.update({
       where:{
          id:user?.id
       },
       data:{
          passwordHash
       }
   });
    
   //  
}



export const  AuthServices = {
    getNewAccessToken,
    resetPassword
} 