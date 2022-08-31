/*
  Warnings:

  - You are about to drop the column `accepted` on the `Inscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inscription" DROP COLUMN "accepted";

-- CreateTable
CREATE TABLE "Etablissement" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "abrev" TEXT NOT NULL,
    "identifiant" TEXT,
    "paysVille" TEXT NOT NULL,
    "address" TEXT,
    "membres" TEXT[],

    CONSTRAINT "Etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Etablissement_membres_key" ON "Etablissement"("membres");
