/*
  Warnings:

  - Added the required column `userId` to the `Factures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factures" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Factures" ADD CONSTRAINT "Factures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
