import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { renderImage } from './utils/renderImage';
import { renderFullMap } from './utils/renderFullMap';
import { decompressTileCode } from './utils/decompressTileCode';
import { TileData } from '../tile-data/tile-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal, getConnection, getRepository } from 'typeorm';

@Injectable()
export class RendererService {
    private readonly logger = new Logger(RendererService.name);
    private currentlyReadingImages = false;

    constructor(
        @InjectRepository(TileData) private tileData: Repository<TileData> // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Cron('* * * * * *')
    async renderImages() {
        if (!this.currentlyReadingImages) {
            // pause futher renders will processing
            this.currentlyReadingImages = true;
            const tiles = await getRepository(TileData)
                .createQueryBuilder('tile_data')
                .where(
                    '(image_data !~~ image_data_live) OR (image_data is not null AND image_data_live is null)'
                )
                .orderBy('id', 'ASC')
                .getMany();

            // if there are tiles, render images, then render full map
            if (tiles.length > 0) {
                // Cycle through all tiles
                for (let i = 0; i < tiles.length; i++) {
                    const image_data = tiles[i].image_data;
                    try {
                        // Try to render image and place the .png on the public folder
                        this.logger.log(`1 - Rendering image ${tiles[i].id}`);
                        await renderImage(
                            image_data,
                            '../wov-backend/cache/' + tiles[i].id + '.png'
                        );

                        // Update database so that blockchain image data matches live image data
                        await this.update(tiles[i].id, {
                            image_data_live: image_data,
                        });

                        // unpause further rendering
                    } catch (e) {
                        this.logger.error('rendering image failed: ', e);
                    }
                }
                // render full image map
                const allTiles = await getRepository(TileData)
                    .createQueryBuilder('tile_data')
                    .orderBy('id', 'ASC')
                    .getMany();
                await renderFullMap(allTiles, '../wov-backend/cache/wov.png');
                this.logger.log(`Rendered full map`);
                this.currentlyReadingImages = false;
            } else {
                this.currentlyReadingImages = false;
            }
        }
    }

    async update(id: number, attrs: Partial<TileData>) {
        const tile = await this.tileData.findOne(id);
        Object.assign(tile, attrs);
        return this.tileData.save(tile);
    }
}
