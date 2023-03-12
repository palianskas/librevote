-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_campaignId_fkey";

-- AlterTable
ALTER TABLE "District" ALTER COLUMN "campaignId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
