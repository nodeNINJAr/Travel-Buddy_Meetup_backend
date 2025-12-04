
import { prisma } from "../../../lib/prisma.js";
import { IUser } from "../../../type/index.js";
import AppError from "../../middlewares/appError.js";
import { GetAllUsersParams } from "./user.interfaces.js";


export const UserServices = {
  // Create User
  async createUser(payload:IUser ) {
    if(!payload.email){
         throw new AppError(404,"Email not found")
    }
    const record = await prisma.user.findFirst({
          where:{
             email:payload?.email
          }
    })
   if(record){
      throw new AppError(409,"User already exist")
   }

    // 
  const user = await prisma.user.create({
    data: {
      userName: payload.userName,
      email: payload.email,
      passwordHash: payload.password,
      image: payload.image,
    },
  });
    return user;
  },

  // Update User
  async updateUser(id: number | string, payload: IUser) {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
      userName: payload.userName,
      email: payload.email,
      image: payload.image,
    },
    });
    return user;
  },

  // Get All Users with pagination, filtering
  async getAllUsers(params: GetAllUsersParams) {
    const { page, limit, sortBy, sortOrder, searchTerm, filters } = params;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Apply search term
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Apply filters
    if (filters) {
      Object.assign(where, filters);
    }

    const total = await prisma.user.count({ where });
    const data = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: { profile: true },
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  // Get Single User
  async getUserById(id: number | string) {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { profile: true },
    });
    return user;
  },

  // Delete User
  async deleteUser(id: number | string) {
    return await prisma.user.delete({
      where: { id: Number(id) },
    });
  },
};
