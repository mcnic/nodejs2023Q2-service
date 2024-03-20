import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.interface';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAll(): Promise<Track[]> {
    return await this.trackService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Track | undefined> {
    return await this.trackService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() dto: Track) {
    return await this.trackService.add(dto);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() dto: Track,
  ): Promise<Track> {
    return await this.trackService.changeById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id') id: string) {
    await this.trackService.removeById(id);
  }
}
