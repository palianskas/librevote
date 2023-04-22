import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/modules/auth.module/routes/models/auth-contracts.model';
import { VotingVoucherDto } from '../models/voting-voucher.model';
import { VouchersService } from '../vouchers.service';
import { VoucherCreateHandler } from './handlers/voucher-create.handler';
import {
  IBulkVoteVoucherCreateRequest,
  IBulkVoteVoucherCreateResponse,
  IVoteVoucherCreateRequest,
  IVoteVoucherCreateResponse,
  IVoteVoucherSearchRequest,
  IVoteVoucherSearchResponse,
  UserVouchersResponse,
} from './models/vote-vouchers-contracts.model';
import { VoucherSearchHandler } from './handlers/voucher-search.handler';
import { Public } from 'src/modules/auth.module/guards/guard-activators.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(
    private readonly voucherService: VouchersService,
    private readonly voucherCreateHandler: VoucherCreateHandler,
    private readonly voucherSearchHandler: VoucherSearchHandler,
  ) {}

  @Get('pending')
  async getPendingUserVouchers(
    @Req() request: IAuthenticatedRequest,
  ): Promise<UserVouchersResponse> {
    const filter = {
      designatedUserId: request.user.id,
      isSpent: false,
    };

    const vouchers = await this.voucherService.search(filter);

    const dtos = VotingVoucherDto.mapList(vouchers);

    const response: UserVouchersResponse = {
      userId: request.user.id,
      dtos: dtos,
    };

    return response;
  }

  @Public()
  @Get(':id')
  async get(@Param('id') id: string): Promise<VotingVoucherDto> {
    const voucher = await this.voucherService.get(id);

    if (!voucher) {
      throw new NotFoundException(`Voting voucher not found by id ${id}`);
    }

    const dto = VotingVoucherDto.map(voucher);

    return dto;
  }

  @Post()
  async create(
    @Body() createRequest: IVoteVoucherCreateRequest,
    @Req() request: IAuthenticatedRequest,
  ): Promise<IVoteVoucherCreateResponse> {
    const user = request.user;

    const id = await this.voucherCreateHandler.handle(createRequest, user);

    const response: IVoteVoucherCreateResponse = {
      id: id,
    };

    return response;
  }

  @Post('bulk')
  async createMany(
    @Body() createRequest: IBulkVoteVoucherCreateRequest,
    @Req() request: IAuthenticatedRequest,
  ): Promise<IBulkVoteVoucherCreateResponse> {
    const user = request.user;

    const result = await this.voucherCreateHandler.handleForBulkAction(
      createRequest,
      user,
    );

    const response: IBulkVoteVoucherCreateResponse = {
      count: result,
    };

    return response;
  }

  @Post('search')
  async search(
    @Body() searchRequest: IVoteVoucherSearchRequest,
    @Req() request: IAuthenticatedRequest,
  ): Promise<IVoteVoucherSearchResponse> {
    const user = request.user;

    const response = await this.voucherSearchHandler.handle(
      searchRequest,
      user,
    );

    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const entity = await this.voucherService.get(id);

    if (!entity) {
      throw new NotFoundException(`Voucher not found by id ${id}`);
    }

    if (!!entity.deleteDate) {
      return;
    }

    entity.deleteDate = new Date();

    const dto = VotingVoucherDto.map(entity);

    await this.voucherService.update(dto);
  }
}
