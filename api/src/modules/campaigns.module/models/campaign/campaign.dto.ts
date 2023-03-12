import { CampaignUserDto } from '../campaign-user/campaign-user.dto';
import { DistrictDto } from '../district/district.dto';
import { Campaign } from './campaign.model';

export class CampaignDto {
  id?: string;
  name: string;
  pubKey: string;
  campaignUsers: CampaignUserDto[];
  districts: DistrictDto[];

  static map(entity: Campaign): CampaignDto {
    const dto = new CampaignDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.pubKey = entity.pubKey;
    dto.campaignUsers = CampaignUserDto.mapList(entity.campaignUsers);
    dto.districts = DistrictDto.mapList(entity.districts);

    return dto;
  }
}
