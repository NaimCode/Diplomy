-- DropIndex
DROP INDEX "User_etablissementId_key";

-- AlterTable
ALTER TABLE "Etablissement" ALTER COLUMN "membresAutorises" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locale" TEXT;
