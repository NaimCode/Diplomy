/*
  Warnings:

  - Added the required column `etablissementId` to the `ContractMembre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractMembre" ADD COLUMN     "etablissementId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ContractMembre" ADD CONSTRAINT "ContractMembre_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
