import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TileData } from '../tile-data/tile-data.entity';
import { Repository } from 'typeorm';
import { BASE_IMAGE } from '../constants/misc';

@Injectable()
export class MetadataService {
  constructor(@InjectRepository(TileData) private repo: Repository<TileData>) {}

  async getMetadata(id: number) {
    return await this.repo
      .find({
        select: ['id', 'name', 'image_data', 'url', 'price', 'owner'],
        where: { id },
        order: { id: 'ASC' },
      })
      .then((res) => {
        let _image;
        if (!res[0].image_data) {
          _image = BASE_IMAGE + 'empty.png';
        } else {
          _image = BASE_IMAGE + res[0].id + '.png';
        }

        return {
          id: res[0].id,
          name: res[0].name || '',
          image: _image,
          image_data: res[0].image_data || '',
          url: res[0].url || '',
          price: res[0].price || 0,
          owner: res[0].owner || '',
          approved: res[0].approved || '',
        };
      });
  }

  async getMetadataAll() {
    return await this.repo
      .find({
        select: ['id', 'name', 'image_data', 'url', 'price', 'owner'],
        order: { id: 'ASC' },
      })
      .then((res) => {
        let arr = [];
        res.map((tile) => {
          let _image;
          if (!tile.image_data) {
            _image = BASE_IMAGE + 'empty.png';
          } else {
            _image = BASE_IMAGE + tile.id + '.png';
          }
          arr.push({
            id: tile.id,
            name: tile.name || '',
            image: _image,
            image_data: tile.image_data || '',
            url: tile.url || '',
            price: tile.price || 0,
            owner: tile.owner || '',
            approved: res[0].approved || '',
          });
        });
        return arr;
      });
  }
}
