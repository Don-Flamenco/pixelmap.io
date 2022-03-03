import { Module } from '@nestjs/common';
import { RendererService } from './renderer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileData } from '../tile-data/tile-data.entity';
import { RendererController } from './renderer.controller';

@Module({
    providers: [RendererService],
    imports: [TypeOrmModule.forFeature([TileData])],
    controllers: [RendererController],
})
export class RendererModule {}
