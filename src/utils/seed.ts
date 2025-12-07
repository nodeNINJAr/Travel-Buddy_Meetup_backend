import config from "../config/index.js";
import { Role } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { IUser } from "../type/index.js";
import { hashPassword } from "./hash.utils.js";


export const seedAdmin =async()=>{
    // 
      try{
        const isSuperAdminExist = await prisma.user.findUnique({
              where:{
                email:config.ADMIN_EMAIL
              }
        });
        // 
        if(isSuperAdminExist){
            console.log("Super Admin alredy exists");
            return 
        }

    // hasded pass by bcript
     const hashed = await hashPassword(config.ADMIN_PASS)
        //  

    // 
    const payLoad = {
        userName:"Admin",
        email:config.ADMIN_EMAIL,
        role:Role.ADMIN,
        emailVerified:true,
        passwordHash:hashed,
    }
      //    
      const admin = await prisma.user.create({
           data:payLoad
      })



      }catch(err){
        console.log(err);
      }
}