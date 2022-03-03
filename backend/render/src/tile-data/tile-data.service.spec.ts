import { Test, TestingModule } from '@nestjs/testing';
import { TileDataService } from './tile-data.service';

describe('TileDataService', () => {
  let service: TileDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TileDataService],
    }).compile();

    service = module.get<TileDataService>(TileDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
