/*
  Warnings:

  - You are about to drop the `_condition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_condition" DROP CONSTRAINT "_condition_A_fkey";

-- DropForeignKey
ALTER TABLE "_condition" DROP CONSTRAINT "_condition_B_fkey";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "conditionsId" TEXT[];

-- DropTable
DROP TABLE "_condition";
