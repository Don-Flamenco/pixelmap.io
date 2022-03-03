import { Injectable, OnModuleInit } from '@nestjs/common';
import { MerkleTree } from 'merkletreejs';
const keccak256 = require('keccak256');
import { InjectRepository } from '@nestjs/typeorm';
import { WhitelistData } from './whitelist.entity';
import { Repository } from 'typeorm';
const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet } = require('@vechain/connex.driver-nodejs');
import { SIMPLENET } from '../constants/misc';
import { WOV_CONTRACT } from '../constants/addresses';

// whiteList addresses generate the root
// apply root to smart contract
// end user gets proof from this api and single address
// on smart contract, use proof to verify against root and leaf (sender address)

let driver;
let thor;
let contract;

const whitelistClaimedAbi = {
  inputs: [
    {
      internalType: 'address',
      name: '',
      type: 'address',
    },
  ],
  name: 'whitelistClaimed',
  outputs: [
    {
      internalType: 'bool',
      name: '',
      type: 'bool',
    },
  ],
  stateMutability: 'view',
  type: 'function',
};

@Injectable()
export class WhitelistService implements OnModuleInit {
  constructor(
    @InjectRepository(WhitelistData) private repo: Repository<WhitelistData>,
  ) {}

  async onModuleInit() {
    driver = await Driver.connect(new SimpleNet(SIMPLENET));
    thor = new Framework(driver).thor;
    contract = await thor.account(WOV_CONTRACT);
  }

  async getRoot() {
    return await this.repo
      .find({
        select: ['address'],
      })
      .then((res) => {
        const leafNodes = res.map((record) => {
          return keccak256(record.address);
        });
        const merkleTree = new MerkleTree(leafNodes, keccak256, {
          sort: true,
        });
        return merkleTree.getHexRoot();
      });
  }

  async getProof(address: string) {
    return await this.repo
      .find({
        select: ['address'],
      })
      .then((res) => {
        const leafNodes = res.map((record) => {
          return keccak256(record.address);
        });
        const merkleTree = new MerkleTree(leafNodes, keccak256, {
          sort: true,
        });
        return merkleTree.getHexProof(keccak256(String(address)));
      });
  }

  async onWhitelist(address: string) {
    return await this.repo
      .find({
        select: ['address'],
      })
      .then(async (res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].address.toLowerCase() == address.toLowerCase()) {
            const getClaimedStatus = await contract.method(whitelistClaimedAbi);
            const result = await getClaimedStatus.call(address);
            return { active: true, claimed: result.decoded[0] };
          }
        }
        return { active: false, claimed: false };
      });
  }
}
