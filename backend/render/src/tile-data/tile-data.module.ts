import { Module } from '@nestjs/common';
import { TileDataService } from './tile-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileData } from './tile-data.entity';
import { TileDataController } from './tile-data.controller';

@Module({
  providers: [TileDataService],
  controllers: [TileDataController],
  imports: [TypeOrmModule.forFeature([TileData])],
})
export class TileDataModule {}
