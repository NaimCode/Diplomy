-- AlterTable
ALTER TABLE "Diplome" ADD COLUMN     "canvasId" TEXT;

-- CreateTable
CREATE TABLE "Canvas" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Canvas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Diplome" ADD CONSTRAINT "Diplome_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
