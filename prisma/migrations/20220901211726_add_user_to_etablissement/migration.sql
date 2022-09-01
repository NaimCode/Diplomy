/*
  Warnings:

  - You are about to drop the column `membres` on the `Etablissement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[membresAutorises]` on the table `Etablissement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[etablissementId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `etablissementId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Etablissement_membres_key";

-- AlterTable
ALTER TABLE "Etablissement" DROP COLUMN "membres",
ADD COLUMN     "membresAutorises" TEXT[],
ALTER COLUMN "paysVille" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "etablissementId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Etablissement_membresAutorises_key" ON "Etablissement"("membresAutorises");

-- CreateIndex
CREATE UNIQUE INDEX "User_etablissementId_key" ON "User"("etablissementId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
