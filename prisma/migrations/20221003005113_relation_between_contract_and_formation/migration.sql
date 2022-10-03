-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "aboutissementId" TEXT;

-- CreateTable
CREATE TABLE "_condition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_condition_AB_unique" ON "_condition"("A", "B");

-- CreateIndex
CREATE INDEX "_condition_B_index" ON "_condition"("B");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_aboutissementId_fkey" FOREIGN KEY ("aboutissementId") REFERENCES "Formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_condition" ADD CONSTRAINT "_condition_A_fkey" FOREIGN KEY ("A") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_condition" ADD CONSTRAINT "_condition_B_fkey" FOREIGN KEY ("B") REFERENCES "Formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
