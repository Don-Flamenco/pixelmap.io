import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhitelistController } from './whitelist.controller';
import { WhitelistService } from './whitelist.service';
import { WhitelistData } from './whitelist.entity';

@Module({
  controllers: [WhitelistController],
  imports: [TypeOrmModule.forFeature([WhitelistData])],
  providers: [WhitelistService],
})
export class WhitelistModule {}
