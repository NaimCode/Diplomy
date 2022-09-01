/*
  Warnings:

  - You are about to drop the column `userId` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_userId_fkey";

-- DropIndex
DROP INDEX "Utilisateur_userId_key";

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "userId";
