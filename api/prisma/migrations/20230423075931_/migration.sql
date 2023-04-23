/*
  Warnings:

  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CampaignUserToDistrict` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_parentDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignUserToDistrict" DROP CONSTRAINT "_CampaignUserToDistrict_A_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignUserToDistrict" DROP CONSTRAINT "_CampaignUserToDistrict_B_fkey";

-- DropTable
DROP TABLE "District";

-- DropTable
DROP TABLE "_CampaignUserToDistrict";
