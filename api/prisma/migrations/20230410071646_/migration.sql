/*
  Warnings:

  - A unique constraint covering the columns `[campaignId]` on the table `CampaignResults` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CampaignResults_campaignId_key" ON "CampaignResults"("campaignId");
