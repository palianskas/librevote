/*
  Warnings:

  - Changed the type of `totalVoteCount` on the `CampaignResults` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `voteCount` on the `CandidateResults` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CampaignResults" DROP COLUMN "totalVoteCount",
ADD COLUMN     "totalVoteCount" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "CandidateResults" DROP COLUMN "voteCount",
ADD COLUMN     "voteCount" BYTEA NOT NULL;
