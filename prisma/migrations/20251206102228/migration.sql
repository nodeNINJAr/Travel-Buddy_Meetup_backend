/*
  Warnings:

  - The `status` column on the `trips` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TravelPlanStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "status",
ADD COLUMN     "status" "TravelPlanStatus" NOT NULL DEFAULT 'ACTIVE';
