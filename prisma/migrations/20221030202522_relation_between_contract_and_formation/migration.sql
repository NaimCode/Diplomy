/*
  Warnings:

  - You are about to drop the column `etablessementId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `etablissementId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_etablessementId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "etablessementId",
ADD COLUMN     "etablissementId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
