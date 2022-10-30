-- CreateEnum
CREATE TYPE "AvisMembre" AS ENUM ('REFUSE', 'ATTENTE', 'ACCEPTE', 'ACCEPTE_EN_SURCIS');

-- AlterTable
ALTER TABLE "ContractMembre" ADD COLUMN     "avis" "AvisMembre" NOT NULL DEFAULT 'ATTENTE';
