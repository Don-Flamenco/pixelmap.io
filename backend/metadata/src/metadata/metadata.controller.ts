import { Controller, Get, Param } from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Controller('/metadata')
export class MetadataController {
  constructor(public metadataService: MetadataService) {}

  @Get()
  getJsonAll() {
    return this.metadataService.getMetadataAll();
  }

  @Get(':id')
  getJson(@Param('id') id: string) {
    return this.metadataService.getMetadata(parseInt(id));
  }
}
