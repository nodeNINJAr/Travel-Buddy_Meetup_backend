-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "message" TEXT,
ADD COLUMN     "tripId" INTEGER;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
