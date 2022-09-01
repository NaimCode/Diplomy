/*
  Warnings:

  - The primary key for the `Utilisateur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id");
