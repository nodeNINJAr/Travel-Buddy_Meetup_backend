import { Role, UserStatus } from "../generated/prisma/enums.js";

export interface IUser {
  userName: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  password:string;
}


export interface VUser{
    id: number;
    email: string;
    role: Role;
    emailVerified:boolean;
    activeStatus:UserStatus
}