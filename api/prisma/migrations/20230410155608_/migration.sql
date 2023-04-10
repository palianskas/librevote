/*
  Warnings:

  - A unique constraint covering the columns `[candidateId]` on the table `CandidateResults` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CandidateResults_candidateId_key" ON "CandidateResults"("candidateId");

-- AddForeignKey
ALTER TABLE "CandidateResults" ADD CONSTRAINT "CandidateResults_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CampaignCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
