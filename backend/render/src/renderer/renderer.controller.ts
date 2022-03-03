import { Get, Controller } from '@nestjs/common';
import { RendererService } from './renderer.service';

@Controller('r')
export class RendererController {
  constructor(private tileDataService: RendererService) {}

  @Get('/t')
  async updateEvents() {
    return 'hi';
  }
}
