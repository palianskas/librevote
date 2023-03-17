import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../../data.module/data.service';
import { IPrismaQuery } from '../../data.module/models/prisma-query.model';
import { DistrictDto } from '../models/district/district.dto';
import { District } from '../models/district/district.model';

/**
 * @deprecated Requirement for districts removed
 */
@Injectable()
export class DistrictsRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<District | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const district = await this.dataService.district.findFirst(query);

    return district;
  }

  async create(dto: DistrictDto): Promise<District> {
    const result = await this.dataService.district.create({
      data: {
        campaignId: dto.campaignId!,
        name: dto.name,
        parentDistrictId: dto.parentDistrictId,
      },
    });

    return result;
  }

  private buildQuery(filter: any): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
      include: {
        campaign: true,
        parentDistrict: true,
        childDistricts: true,
        campaignUsers: true,
      },
    };

    return query;
  }
}
