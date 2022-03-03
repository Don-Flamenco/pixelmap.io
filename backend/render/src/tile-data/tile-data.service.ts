import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TileData } from './tile-data.entity';
import { abiTile, abiTileUpdatedEvent, abiMint } from '../lib/abiSignatures';
import { WOV_CONTRACT, TOPIC_MINT, TOPIC_UPDATE } from '../constants/addresses';
import { TOTAL_TILES, SIMPLENET } from '../constants/misc';
const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet } = require('@vechain/connex.driver-nodejs');
const convert = require('ethereum-unit-converter');

@Injectable()
export class TileDataService implements OnModuleInit {
    private readonly logger = new Logger(TileDataService.name);
    private monitorActive = true;
    constructor(
        @InjectRepository(TileData) private repo: Repository<TileData>
    ) {}
    async onModuleInit() {
        const driver = await Driver.connect(new SimpleNet(SIMPLENET));

        const thor = new Framework(driver).thor;

        const currentBlock = await thor.status.head.number;
        const contract = await thor.account(WOV_CONTRACT);
        const getTileMethod = await contract.method(abiTile);

        await this.initialSyncTiles(
            getTileMethod,
            TOTAL_TILES,
            currentBlock,
            thor
        );
        this.logger.log('Imported latest data from thor.');

        const blockTracker = await thor.status.head.number;
        this.monitorBlocks(thor, getTileMethod, blockTracker);
    }

    // creates tiles from blockchain
    async initialSyncTiles(getTileMethod, totalTiles, startingBlock, thor) {
        for (var id = 0; id < totalTiles; id++) {
            // call tileData smart contract function
            const result = await getTileMethod.call(id);
            if (!(id % 100)) {
                console.log('Imported: ', id);
            }
            const tileData = result.decoded;

            const attr = {
                name: tileData.name || '',
                image_data: tileData.image_data || '',
                image_data_live: '',
                url: tileData.url || '',
                price: tileData.price || 0,
                owner: tileData.owner || '',
                lastUpdate: startingBlock,
            };
            await this.update(id, attr);
        }
        const currentBlock = thor.status.head.number;
        console.log(
            `Started at block ${startingBlock}, currently at block ${currentBlock}`
        );
        await this.replayBlocks(thor, getTileMethod, startingBlock);
    }

    // ongoing monitor of new events
    async monitorBlocks(thor, getTileMethod, _blockTracker) {
        let blockTracker = _blockTracker;
        while (this.monitorActive) {
            const head = await thor.ticker().next();
            const currentBlock = head.number;
            console.log(
                'blockTracker',
                blockTracker,
                'currentBlock',
                currentBlock
            );
            if (currentBlock == blockTracker + 1) {
                blockTracker = currentBlock;
                console.log('monitoring block: ', currentBlock);
                this.filterEvents(thor, currentBlock, getTileMethod);
            } else {
                this.replayBlocks(thor, getTileMethod, blockTracker);
                blockTracker = currentBlock;
            }
        }
    }

    // catch up on missed blocks
    async replayBlocks(thor, getTileMethod, startingBlock) {
        let currentBlock = await thor.status.head.number;
        for (let i = startingBlock; i <= currentBlock; i++) {
            console.log(
                `Replaying block - processing block ${i}, current block ${currentBlock}`
            );
            await this.filterEvents(thor, i, getTileMethod);
            currentBlock = await thor.status.head.number;
        }
    }

    async filterEvents(thor, block, getTileMethod) {
        // query thor for events on specified block
        await thor
            .filter('event', [
                {
                    address: WOV_CONTRACT,
                },
            ])
            .range({
                unit: 'block',
                from: block,
                to: block,
            })
            .apply(0, 256)
            .then(async (events) => {
                let mintEvents = [];
                let updateEvents = [];

                // separate mint and updates in this block
                for (var i = 0; i < events.length; i++) {
                    if (events[i].topics[0] == TOPIC_UPDATE) {
                        updateEvents.push(events[i]);
                    }
                    if (events[i].topics[0] == TOPIC_MINT) {
                        mintEvents.push(events[i]);
                    }
                }

                if (mintEvents.length) {
                    await this.processMints(
                        mintEvents,
                        thor,
                        block,
                        getTileMethod
                    );
                }

                if (updateEvents.length) {
                    await this.processUpdates(
                        updateEvents,
                        thor,
                        block,
                        getTileMethod
                    );
                }
            })
            .catch(async (err) => {
                // large number of transactions crashes app
                console.error('filter event error', err);
                await this.replayBlocks(thor, getTileMethod, block);
            });
    }

    async processUpdates(updateEvents, thor, block, getTileMethod) {
        // process and import update events

        for (var j = 0; j < updateEvents.length; j++) {
            await thor
                .account(WOV_CONTRACT)
                .event(abiTileUpdatedEvent)
                .filter([]) //todo filter this down to ensure correct
                .range({
                    unit: 'block',
                    from: block,
                    to: block,
                })
                .apply(j, 1)
                .then(async (event) => {
                    const id = event[0].decoded.location;
                    this.logger.log('Processing a change for token ID: ' + id);
                    const lastUpdate = event[0].meta.blockNumber;
                    // getTileMethod returns {name, image, image_data, url}
                    const tileAttrs = await this.getTile(id, getTileMethod);
                    await this.update(id, {
                        ...tileAttrs,
                        lastUpdate,
                    });
                });
        }
    }

    // process and import mint events
    async processMints(mintEvents, thor, block, getTileMethod) {
        for (var i = 0; i < mintEvents.length; i++) {
            await thor
                .account(WOV_CONTRACT)
                .event(abiMint)
                .filter([]) //todo filter this down to ensure correct
                .range({
                    unit: 'block',
                    from: block,
                    to: block,
                })
                .apply(i, 1)
                .then(async (event) => {
                    const id = event[0].decoded.tokenId;

                    this.logger.log(
                        'Processing a new mint for token ID: ' + id
                    );

                    const lastUpdate = event[0].meta.blockNumber;
                    const tileAttrs = await this.getTile(id, getTileMethod);

                    // updates current pending block in db
                    await this.update(id, {
                        ...tileAttrs,
                        lastUpdate,
                    });
                });
        }
    }

    async update(id: number, attrs: Partial<TileData>) {
        let priceVET;
        if (attrs.price != undefined) {
            priceVET = convert(attrs.price, 'wei', 'ether') || 0;
            attrs.price = priceVET;
        }
        const tile = await this.repo.findOne(id);
        if (!tile) {
            console.log('tile not found, creating new tile: ', id);
            const newTile = {
                id,
                ...attrs,
            };
            return this.repo.save(newTile);
        }
        Object.assign(tile, attrs);
        return this.repo.save(tile);
    }

    async getTile(id, method) {
        const result = await method.call(id);
        return result.decoded;
    }

    sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
}
