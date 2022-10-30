/*
  Warnings:

  - The values [ACCEPTE,ACCEPTE_EN_SURCIS] on the enum `AvisMembre` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AvisMembre_new" AS ENUM ('REFUSE', 'ATTENTE', 'CONFIRME', 'CONFIRME_CONDITION');
ALTER TABLE "ContractMembre" ALTER COLUMN "avis" DROP DEFAULT;
ALTER TABLE "ContractMembre" ALTER COLUMN "avis" TYPE "AvisMembre_new" USING ("avis"::text::"AvisMembre_new");
ALTER TYPE "AvisMembre" RENAME TO "AvisMembre_old";
ALTER TYPE "AvisMembre_new" RENAME TO "AvisMembre";
DROP TYPE "AvisMembre_old";
ALTER TABLE "ContractMembre" ALTER COLUMN "avis" SET DEFAULT 'ATTENTE';
COMMIT;
