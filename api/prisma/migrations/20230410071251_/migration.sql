-- AddForeignKey
ALTER TABLE "CampaignResults" ADD CONSTRAINT "CampaignResults_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
