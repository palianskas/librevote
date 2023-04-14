import { Component, Input, OnInit } from '@angular/core';
import { CampaignResults } from 'src/app/campaigns.module/models/campaign-results/campaign-results.model';
import { CandidateResults } from 'src/app/campaigns.module/models/campaign-results/candidate.results.model';
import { ColorsService } from 'src/app/common.module/services/colors.service';

@Component({
  selector: 'app-campaign-results-display',
  templateUrl: './campaign-results-display.component.html',
})
export class CampaignResultsDisplayComponent implements OnInit {
  @Input() results: CampaignResults;

  candidateColors: number[];

  constructor(private readonly colorsService: ColorsService) {}

  ngOnInit(): void {
    this.candidateColors = this.colorsService.getHueSpectrum(
      this.results.candidateResults.length
    );
  }

  getResultsBarWidthPropValue(candidateResults: CandidateResults): string {
    const percentage = this.getCandidateResultsPercentage(candidateResults);

    return `calc(${percentage}% + ${percentage < 5 ? '25' : '0'}px)`;
  }

  getCandidateResultsPercentage(candidateResults: CandidateResults): number {
    const candidateVoteCount = Number(candidateResults.voteCount);
    const totalVoteCount = Number(this.results.totalVoteCount);

    return (candidateVoteCount / totalVoteCount) * 100;
  }

  getCandidateColor(candidateIndex: number): string {
    const hue = this.candidateColors[candidateIndex];

    const color = `hsl(${hue} 100% 67%)`;

    return color;
  }

  getCandidateResultsSummary(candidateResults: CandidateResults): string {
    const percentage =
      this.getCandidateResultsPercentage(candidateResults).toFixed(3);

    return `${candidateResults.candidate.name}: ${candidateResults.voteCount} vote(s) (${percentage}%)`;
  }
}
