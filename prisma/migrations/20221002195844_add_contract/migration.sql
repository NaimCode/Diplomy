-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractMembre" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "accept" BOOLEAN NOT NULL DEFAULT false,
    "contractId" TEXT NOT NULL,

    CONSTRAINT "ContractMembre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContractMembre_contractId_key" ON "ContractMembre"("contractId");

-- AddForeignKey
ALTER TABLE "ContractMembre" ADD CONSTRAINT "ContractMembre_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
