import passport from "passport"
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";





// login with credientials
passport.use(
   new localStrategy({
      usernameField:"email",
      passwordField:"password",
   }, async(email:string, password:string, done)=>{

        try {
            // is user exist
            const isUserExist = await prisma.user.findFirst({
                where:{
                    email
                }
            });
        
            //  
              if (!isUserExist) {
                return done("User does not exist")
            }
           //   
            if(!isUserExist){
                 return done(null, false, {message:"User does not exist"})
            }  
 
          //   is passwordmatched
          const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.passwordHash as string) 
           //password compare
           if(!isPasswordMatched){
             return done(null, false , {message:"password doesnt match"})
           } 
          
          return done(null,isUserExist)
           
       } catch (error) {
           console.log(error);
           done(error)
       }

   } 
))


// 
passport.serializeUser((user:any, done:(err:any, id?:unknown)=> void)=>{
     done(null, user.id)
}) 


// 
passport.deserializeUser(async (id:number, done:any) => {
    
    try {
      const user = await prisma.user.findUnique({
                where:{
                    id
                }
            });
      done(null, user)
    } catch (error) {
         console.log(error);
         done(error)
    }

})