import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileData } from './tile-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TileData])],
})
export class TileDataModule {}
