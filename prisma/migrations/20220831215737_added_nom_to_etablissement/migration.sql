/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Etablissement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifiant]` on the table `Etablissement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nom` to the `Etablissement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Etablissement" ADD COLUMN     "nom" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Etablissement_nom_key" ON "Etablissement"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Etablissement_identifiant_key" ON "Etablissement"("identifiant");
