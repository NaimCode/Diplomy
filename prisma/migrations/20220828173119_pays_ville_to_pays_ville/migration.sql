/*
  Warnings:

  - You are about to drop the column `pays_ville` on the `Inscription` table. All the data in the column will be lost.
  - Added the required column `paysVille` to the `Inscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inscription" DROP COLUMN "pays_ville",
ADD COLUMN     "paysVille" TEXT NOT NULL;
