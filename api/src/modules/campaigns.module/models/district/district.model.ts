import { District as DistrictEntity } from '@prisma/client';
import { Campaign } from '../campaign/campaign.model';

export type District = DistrictEntity & {
  campaign?: Campaign;
  parentDistrict?: District;
  childDistricts?: District[];
};
