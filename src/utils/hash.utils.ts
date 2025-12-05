import bcrypt from "bcrypt"
import config from "../config/index.js";


const SALT_ROUNDS = Number(config.solt_round);

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
