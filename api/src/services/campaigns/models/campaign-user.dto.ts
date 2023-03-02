import { UserDto } from 'src/services/users/models/user.dto';
import { CampaignUserRole } from './campaign-user-role.enum';
import { CampaignUser } from './campaign-user.model';
import { CampaignDto } from './campaign.dto';

export class CampaignUserDto {
  userId: string;
  role: CampaignUserRole;
  campaignId?: string;
  campaign?: CampaignDto;
  user?: UserDto;

  static map(entity: CampaignUser): CampaignUserDto {
    const dto = new CampaignUserDto();

    dto.userId = entity.userId;
    dto.campaignId = entity.campaignId;
    dto.role = CampaignUserRole[entity.role];

    if (!!entity.campaign) {
      dto.campaign = CampaignDto.map(entity.campaign);
    }
    if (!!entity.user) {
      dto.user = UserDto.map(entity.user);
    }

    return dto;
  }

  static mapList(entities: CampaignUser[] | undefined): CampaignUserDto[] {
    if (!entities) {
      return [];
    }

    const result = entities.map((entity) => CampaignUserDto.map(entity));

    return result;
  }
}
