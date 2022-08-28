-- CreateTable
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "abrev" TEXT NOT NULL,
    "identifiant" TEXT,
    "pays_ville" TEXT NOT NULL,
    "address" TEXT,
    "responsable" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);
