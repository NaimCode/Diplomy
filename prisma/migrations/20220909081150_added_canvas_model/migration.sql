/*
  Warnings:

  - The `dureeExpiration` column on the `Diplome` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `intituleDiff` to the `Diplome` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diplome" ADD COLUMN     "intitule" TEXT,
ADD COLUMN     "intituleDiff" BOOLEAN NOT NULL,
DROP COLUMN "dureeExpiration",
ADD COLUMN     "dureeExpiration" INTEGER;
