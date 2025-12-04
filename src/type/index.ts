import { Role } from "../generated/prisma/enums.js";

export interface IUser {
  userName: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  password:string;
}