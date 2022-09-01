/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_email_fkey";

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_userId_key" ON "Utilisateur"("userId");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
