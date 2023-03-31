/*
  Warnings:

  - You are about to drop the column `maxVoterCount` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "maxVoterCount";

-- AlterTable
ALTER TABLE "CampaignSettings" ADD COLUMN     "maxVoterCount" BIGINT NOT NULL DEFAULT 100;
