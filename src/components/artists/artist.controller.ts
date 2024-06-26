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
import { ArtistService } from './artist.service';
import { Artist } from './artist.interface';
import { validateID } from 'src/helpers/validate';
import {
  RemoveFavorite,
  RemoveFavoriteFromArray,
} from 'src/interceptors/removeFavorite.interceptor';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @UseInterceptors(new RemoveFavoriteFromArray())
  async getAll(): Promise<Artist[]> {
    return await this.artistService.getAll();
  }

  @Get(':id')
  @UseInterceptors(new RemoveFavorite())
  async getById(
    @Param('id', validateID) id: string,
  ): Promise<Artist | undefined> {
    return await this.artistService.getById(id);
  }

  @Post()
  @UseInterceptors(new RemoveFavorite())
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() dto: Artist) {
    return await this.artistService.add(dto);
  }

  @Put(':id')
  @UseInterceptors(new RemoveFavorite())
  async update(
    @Param('id', validateID) id: string,
    @Body() dto: Artist,
  ): Promise<Artist> {
    return await this.artistService.changeById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', validateID) id: string) {
    await this.artistService.removeById(id);
  }
}
