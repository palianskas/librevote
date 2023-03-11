import { User, UserDto } from 'src/app/users.module/models/user.model';
import { CampaignUserRole } from './campaign-user-role.enum';
import { Campaign, CampaignDto } from './campaign.model';

export class CampaignUser {
  userId: string;
  campaignId: string;
  role: CampaignUserRole;
  user: User;
  campaign?: Campaign;

  static map(dto: CampaignUserDto): CampaignUser {
    const entity = new CampaignUser();

    entity.userId = dto.userId;
    entity.campaignId = dto.campaignId;
    entity.role = dto.role;

    if (!!dto.campaign) {
      entity.campaign = Campaign.map(dto.campaign);
    }
    if (!!dto.user) {
      entity.user = User.map(dto.user);
    }

    return entity;
  }

  static mapList(entities: any[]): CampaignUser[] {
    if (!entities) {
      return [];
    }

    const result = entities.map((entity) => CampaignUser.map(entity));

    return result;
  }
}
export class CampaignUserDto {
  userId: string;
  campaignId: string;
  role: CampaignUserRole;
  campaign?: CampaignDto;
  user?: UserDto;

  static map(data: any): CampaignUserDto {
    const dto = new CampaignUserDto();

    dto.userId = data.userId;
    dto.campaignId = data.campaignId;
    dto.role = CampaignUserRole[data.role];

    if (!!data.campaign) {
      dto.campaign = CampaignDto.map(data.campaign);
    }
    if (!!data.user) {
      dto.user = UserDto.map(data.user);
    }

    return dto;
  }

  static mapList(entities: any[]): CampaignUserDto[] {
    if (!entities) {
      return [];
    }

    const result = entities.map((entity) => CampaignUserDto.map(entity));

    return result;
  }
}
