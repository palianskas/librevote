import { CampaignUserDto } from '../campaign-user/campaign-user.dto';
import { CampaignDto } from '../campaign/campaign.dto';
import { District } from './district.model';

/**
 * @deprecated Requirement for districts removed
 */
export class DistrictDto {
  id?: string;
  name: string;
  campaignId: string | null;
  parentDistrictId: string | null;
  campaign?: CampaignDto;
  parentDistrict?: DistrictDto;
  childDistricts: DistrictDto[];
  campaignUsers?: CampaignUserDto[];

  static map(entity: District): DistrictDto {
    const dto = new DistrictDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.campaignId = entity.campaignId;
    dto.parentDistrictId = entity.parentDistrictId;

    if (!!entity.campaign) {
      dto.campaign = CampaignDto.map(entity.campaign);
    }

    if (!!entity.parentDistrict) {
      dto.parentDistrict = DistrictDto.map(entity.parentDistrict);
    }

    dto.childDistricts = this.mapList(entity.childDistricts);
    dto.campaignUsers = CampaignUserDto.mapList(entity.campaignUsers);

    return dto;
  }

  static mapList(entities: District[] | undefined): DistrictDto[] {
    if (!entities) {
      return [];
    }

    const dtos = entities.map((entity) => DistrictDto.map(entity));

    return dtos;
  }
}
