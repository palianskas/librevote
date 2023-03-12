import { CampaignUserDto } from '../campaign-user/campaign-user.dto';
import { Campaign } from './campaign.model';

export class CampaignDto {
  id?: string;
  name: string;
  pubKey: string;
  campaignUsers: CampaignUserDto[];

  static map(entity: Campaign): CampaignDto {
    const dto = new CampaignDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.pubKey = entity.pubKey;
    dto.campaignUsers = CampaignUserDto.mapList(entity.campaignUsers);

    return dto;
  }
}
