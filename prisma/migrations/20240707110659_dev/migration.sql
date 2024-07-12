/*
  Warnings:

  - You are about to drop the column `clientId` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_clientId_fkey";

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "clientId",
ALTER COLUMN "creationDate" SET DATA TYPE TEXT,
ALTER COLUMN "modificationDate" SET DATA TYPE TEXT,
ALTER COLUMN "qualificationDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "Accounts";
