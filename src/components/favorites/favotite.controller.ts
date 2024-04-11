import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoritesResponse } from './favorite.interface';
import { validateID } from 'src/helpers/validate';
import { RemoveFavoriteFromFavorites } from 'src/helpers/removeFavorite.interceptor';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @UseInterceptors(new RemoveFavoriteFromFavorites())
  async getAll(): Promise<FavoritesResponse> {
    return await this.favoriteService.getAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id', validateID) id: string) {
    await this.favoriteService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', validateID) id: string) {
    await this.favoriteService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id', validateID) id: string) {
    await this.favoriteService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', validateID) id: string) {
    await this.favoriteService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id', validateID) id: string) {
    await this.favoriteService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', validateID) id: string) {
    await this.favoriteService.removeArtist(id);
  }
}
