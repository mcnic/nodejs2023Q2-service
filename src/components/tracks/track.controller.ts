import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  async getAllTracks(): Promise<Track[]> {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<Track | undefined> {
    return await this.trackService.getTrackById(id);
  }

  @Post()
  @HttpCode(201)
  async addTrack(@Body() dto: Track) {
    return await this.trackService.addTrack(dto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: Track,
  ): Promise<Track> {
    return await this.trackService.changeTrackById(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.trackService.removeTrackdById(id);
  }
}
