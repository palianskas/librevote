-- AddForeignKey
ALTER TABLE "CampaignPublicLink" ADD CONSTRAINT "CampaignPublicLink_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
