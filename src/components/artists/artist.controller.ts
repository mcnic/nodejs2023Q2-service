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
import { ArtistService } from './artist.service';
import { Artist } from './artist.interface';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAll(): Promise<Artist[]> {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Artist | undefined> {
    return await this.artistService.getArtistById(id);
  }

  @Post()
  @HttpCode(201)
  async add(@Body() dto: Artist) {
    return await this.artistService.addArtist(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Artist): Promise<Artist> {
    return await this.artistService.changeArtistById(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.artistService.removeArtistdById(id);
  }
}
