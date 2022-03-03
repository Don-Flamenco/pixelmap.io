import { Test, TestingModule } from '@nestjs/testing';
import { TileDataController } from './tile-data.controller';

describe('TileDataController', () => {
  let controller: TileDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TileDataController],
    }).compile();

    controller = module.get<TileDataController>(TileDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
