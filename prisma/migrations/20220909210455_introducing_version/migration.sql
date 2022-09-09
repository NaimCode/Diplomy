/*
  Warnings:

  - You are about to drop the column `formationId` on the `Diplome` table. All the data in the column will be lost.
  - You are about to drop the column `formationParentId` on the `Formation` table. All the data in the column will be lost.
  - You are about to drop the column `peutAvoirVersion` on the `Formation` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Formation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[diplomeId]` on the table `Formation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `diplomeId` to the `Formation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Diplome" DROP CONSTRAINT "Diplome_formationId_fkey";

-- DropIndex
DROP INDEX "Diplome_formationId_key";

-- AlterTable
ALTER TABLE "Diplome" DROP COLUMN "formationId";

-- AlterTable
ALTER TABLE "Formation" DROP COLUMN "formationParentId",
DROP COLUMN "peutAvoirVersion",
DROP COLUMN "version",
ADD COLUMN     "diplomeId" TEXT NOT NULL,
ADD COLUMN     "versionnage" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Version" (
    "id" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "formationId" TEXT NOT NULL,
    "diplomeId" TEXT NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Version_diplomeId_key" ON "Version"("diplomeId");

-- CreateIndex
CREATE UNIQUE INDEX "Formation_diplomeId_key" ON "Formation"("diplomeId");

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_diplomeId_fkey" FOREIGN KEY ("diplomeId") REFERENCES "Diplome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_diplomeId_fkey" FOREIGN KEY ("diplomeId") REFERENCES "Diplome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
