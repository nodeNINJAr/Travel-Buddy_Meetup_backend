import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
;

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

// Optional: test connection
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully in prisma client");
  } catch (err) {
    console.error("❌ Database connection failed", err);
  }
})();
