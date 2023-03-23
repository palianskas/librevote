/*
  Warnings:

  - Added the required column `isManualVoteStartEndEnabled` to the `CampaignSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CampaignSettings" ADD COLUMN     "isManualVoteStartEndEnabled" BOOLEAN NOT NULL;
