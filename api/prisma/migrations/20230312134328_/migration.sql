-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "parentDistrictId" TEXT,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampaignUserToDistrict" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignUserToDistrict_AB_unique" ON "_CampaignUserToDistrict"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignUserToDistrict_B_index" ON "_CampaignUserToDistrict"("B");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_parentDistrictId_fkey" FOREIGN KEY ("parentDistrictId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignUserToDistrict" ADD CONSTRAINT "_CampaignUserToDistrict_A_fkey" FOREIGN KEY ("A") REFERENCES "CampaignUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignUserToDistrict" ADD CONSTRAINT "_CampaignUserToDistrict_B_fkey" FOREIGN KEY ("B") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;
