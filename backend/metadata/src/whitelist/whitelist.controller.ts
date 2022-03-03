import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';

@Controller('/whitelist')
export class WhitelistController {
  constructor(public whitelistService: WhitelistService) {}

  @Get('/root')
  getRootHash() {
    return this.whitelistService.getRoot();
  }

  @Get('/proof/:address')
  getProof(@Param('address') address: string) {
    return this.whitelistService.getProof(address);
  }

  @Get('/active/:address')
  async onWhitelist(@Param('address') address: string) {
    return await this.whitelistService.onWhitelist(address);
  }
}
