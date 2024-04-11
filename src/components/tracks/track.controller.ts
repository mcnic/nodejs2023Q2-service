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
import { TrackService } from './track.service';
import { Track } from './track.interface';
import { validateID } from 'src/helpers/validate';
import {
  RemoveFavorite,
  RemoveFavoriteFromArray,
} from 'src/interceptors/removeFavorite.interceptor';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @UseInterceptors(new RemoveFavoriteFromArray())
  async getAll(): Promise<Track[]> {
    return await this.trackService.getAll();
  }

  @Get(':id')
  @UseInterceptors(new RemoveFavorite())
  async getById(
    @Param('id', validateID) id: string,
  ): Promise<Track | undefined> {
    return await this.trackService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new RemoveFavorite())
  async add(@Body() dto: Track) {
    return await this.trackService.add(dto);
  }

  @Put(':id')
  @UseInterceptors(new RemoveFavorite())
  async updateById(
    @Param('id', validateID) id: string,
    @Body() dto: Track,
  ): Promise<Track> {
    return await this.trackService.changeById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', validateID) id: string) {
    await this.trackService.removeById(id);
  }
}
