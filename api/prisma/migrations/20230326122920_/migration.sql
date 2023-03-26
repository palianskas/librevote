-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "voucherId" TEXT,
    "value" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,
    "isInvalid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);
