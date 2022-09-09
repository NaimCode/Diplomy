/*
  Warnings:

  - You are about to drop the column `estParent` on the `Formation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Formation" DROP COLUMN "estParent",
ALTER COLUMN "version" DROP NOT NULL;
