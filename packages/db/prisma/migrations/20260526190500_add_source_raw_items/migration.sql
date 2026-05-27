-- CreateTable
CREATE TABLE "SourceRawItem" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceItemId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "policyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceRawItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceRawItem_sourceName_sourceItemId_key" ON "SourceRawItem"("sourceName", "sourceItemId");

-- CreateIndex
CREATE INDEX "SourceRawItem_payloadHash_idx" ON "SourceRawItem"("payloadHash");

-- CreateIndex
CREATE INDEX "SourceRawItem_fetchedAt_idx" ON "SourceRawItem"("fetchedAt");

-- AddForeignKey
ALTER TABLE "SourceRawItem" ADD CONSTRAINT "SourceRawItem_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
