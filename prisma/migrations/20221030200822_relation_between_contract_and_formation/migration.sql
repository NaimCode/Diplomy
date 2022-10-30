-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT NOT NULL,
    "etablessementId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_etablessementId_fkey" FOREIGN KEY ("etablessementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
