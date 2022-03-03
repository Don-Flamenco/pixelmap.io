import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileDataModule } from './tile-data/tile-data.module';
import { ConfigModule } from '@nestjs/config';
import { RendererModule } from './renderer/renderer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(),
        TileDataModule,
        RendererModule,
        ConfigModule.forRoot(),
    ],
})
export class AppModule {}
