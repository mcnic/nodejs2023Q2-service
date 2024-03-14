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
import { AlbumService } from './album.service';
import { Album } from './album.interface';
import { validateID } from 'src/helpers/validate';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAll(): Promise<Album[]> {
    return await this.albumService.getAll();
  }

  @Get(':id')
  async getById(
    @Param('id', validateID) id: string,
  ): Promise<Album | undefined> {
    return await this.albumService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() dto: Album) {
    return await this.albumService.add(dto);
  }

  @Put(':id')
  async update(
    @Param('id', validateID) id: string,
    @Body() dto: Album,
  ): Promise<Album> {
    return await this.albumService.changeById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', validateID) id: string) {
    await this.albumService.removedById(id);
  }
}
