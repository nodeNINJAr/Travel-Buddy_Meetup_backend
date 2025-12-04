import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";
import path from "path";

export default {
  schema: path.join('prisma', 'schema'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  views: {
    path: path.join('prisma', 'views'),
  },
  typedSql: {
    path: path.join('prisma', 'queries'),
  },
  datasource: { 
    url: env("DATABASE_URL") 
  }
} satisfies PrismaConfig;