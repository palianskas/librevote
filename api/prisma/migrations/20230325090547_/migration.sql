/*
  Warnings:

  - You are about to drop the column `imageFileId` on the `CampaignCandidate` table. All the data in the column will be lost.
  - Added the required column `index` to the `CampaignCandidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampaignCandidate" DROP COLUMN "imageFileId",
ADD COLUMN     "index" INTEGER NOT NULL;
