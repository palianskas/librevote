-- CreateTable
CREATE TABLE "CampaignResults" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "totalVoteCount" TEXT NOT NULL,

    CONSTRAINT "CampaignResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateResults" (
    "id" TEXT NOT NULL,
    "campaignResultsId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "voteCount" TEXT NOT NULL,

    CONSTRAINT "CandidateResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateResults" ADD CONSTRAINT "CandidateResults_campaignResultsId_fkey" FOREIGN KEY ("campaignResultsId") REFERENCES "CampaignResults"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
