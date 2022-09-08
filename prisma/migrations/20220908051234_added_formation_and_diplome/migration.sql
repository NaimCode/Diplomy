/*
  Warnings:

  - Added the required column `dureeExpiration` to the `Diplome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiration` to the `Diplome` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diplome" ADD COLUMN     "dureeExpiration" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiration" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Formation" ALTER COLUMN "peutAvoirVersion" SET DEFAULT true;
