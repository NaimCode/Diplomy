/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "address" TEXT,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "etablissementId" DROP NOT NULL,
ALTER COLUMN "etudiantId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_transactionId_key" ON "Contract"("transactionId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
