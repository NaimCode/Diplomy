/*
  Warnings:

  - You are about to drop the column `from` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `signataire` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "from",
ADD COLUMN     "signataire" TEXT NOT NULL;
