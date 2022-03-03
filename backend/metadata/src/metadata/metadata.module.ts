import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileData } from '../tile-data/tile-data.entity';
import { MetadataController } from './metadata.controller';

@Module({
  providers: [MetadataService],
  imports: [TypeOrmModule.forFeature([TileData])],
  controllers: [MetadataController],
})
export class MetadataModule {}
