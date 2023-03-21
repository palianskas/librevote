-- CreateTable
CREATE TABLE "CampaignSettings" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "votingMechanism" TEXT NOT NULL,

    CONSTRAINT "CampaignSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingVoucher" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "validUntilDate" TIMESTAMP(3),
    "designatedUserId" TEXT,

    CONSTRAINT "VotingVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignSettings_campaignId_key" ON "CampaignSettings"("campaignId");

-- AddForeignKey
ALTER TABLE "CampaignSettings" ADD CONSTRAINT "CampaignSettings_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingVoucher" ADD CONSTRAINT "VotingVoucher_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingVoucher" ADD CONSTRAINT "VotingVoucher_designatedUserId_fkey" FOREIGN KEY ("designatedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
