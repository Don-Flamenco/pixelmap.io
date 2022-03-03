import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MetadataModule } from './metadata/metadata.module';
import { TileDataModule } from './tile-data/tile-data.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    TileDataModule,
    MetadataModule,
    WhitelistModule,
    // ServeStaticModule.forRoot({
    //   serveRoot: '/img',
    //   rootPath: join(__dirname, '../..', 'cache'),
    // }),
  ],
  providers: [AppService],
})
export class AppModule {}
