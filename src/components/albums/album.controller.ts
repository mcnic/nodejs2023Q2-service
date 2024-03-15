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
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './album.interface';
import { validateID } from 'src/helpers/validate';
import {
  RemoveFavorite,
  RemoveFavoriteFromArray,
} from 'src/helpers/removeFavorite.interceptor';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @UseInterceptors(new RemoveFavoriteFromArray())
  async getAll(): Promise<Album[]> {
    return await this.albumService.getAll();
  }

  @Get(':id')
  @UseInterceptors(new RemoveFavorite())
  async getById(
    @Param('id', validateID) id: string,
  ): Promise<Album | undefined> {
    return await this.albumService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new RemoveFavorite())
  async add(@Body() dto: Album) {
    return await this.albumService.add(dto);
  }

  @Put(':id')
  @UseInterceptors(new RemoveFavorite())
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
