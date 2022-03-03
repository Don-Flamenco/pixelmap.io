import { Controller, Get, Post, Param } from '@nestjs/common';
import { TileDataService } from './tile-data.service';
const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet } = require('@vechain/connex.driver-nodejs');
import { SIMPLENET } from '../constants/misc';
import { WOV_CONTRACT, TOPIC_MINT, TOPIC_UPDATE } from '../constants/addresses';
import { abiTile, abiTileUpdatedEvent, abiMint } from '../lib/abiSignatures';

@Controller('/regen')
export class TileDataController {
    // constructor(public tileDataService: TileDataService) {}
    // @Get(':startingBlock')
    // async replayBlocks(@Param('startingBlock') startingBlock: string) {
    //     const driver = await Driver.connect(new SimpleNet(SIMPLENET));
    //     const thor = new Framework(driver).thor;
    //     const contract = await thor.account(WOV_CONTRACT);
    //     const getTileMethod = await contract.method(abiTile);
    //     return this.tileDataService.replayBlocks(
    //         thor,
    //         getTileMethod,
    //         startingBlock
    //     );
    // }
}
