/*
  Warnings:

  - A unique constraint covering the columns `[intitule]` on the table `Formation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Formation_intitule_key" ON "Formation"("intitule");
