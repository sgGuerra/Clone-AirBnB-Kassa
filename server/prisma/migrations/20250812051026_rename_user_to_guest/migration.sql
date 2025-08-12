/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `guestId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "userId",
ADD COLUMN     "guestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
