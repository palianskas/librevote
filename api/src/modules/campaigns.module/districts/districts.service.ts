import { Injectable } from '@nestjs/common';
import { DistrictDto } from '../models/district/district.dto';
import { District } from '../models/district/district.model';
import { DistrictsRepository } from './districts.repository';

/**
 * @deprecated Requirement for districts removed
 */
@Injectable()
export class DistrictsService {
  constructor(private readonly districtsRepository: DistrictsRepository) {}

  async get(id: string): Promise<District | null> {
    const district = await this.districtsRepository.get(id);

    return district;
  }

  async create(dto: DistrictDto): Promise<string> {
    const district = await this.districtsRepository.create(dto);

    await this.createChildDistricts(dto, district.id);

    return district.id;
  }

  private async createChildDistricts(
    dto: DistrictDto,
    parentDistrictId: string,
  ): Promise<void> {
    dto.childDistricts.forEach(async (childDistrictDto) => {
      childDistrictDto.parentDistrictId = parentDistrictId;

      const childDistrictEntity = await this.create(childDistrictDto);

      this.createChildDistricts(childDistrictDto, childDistrictEntity);
    });
  }
}
