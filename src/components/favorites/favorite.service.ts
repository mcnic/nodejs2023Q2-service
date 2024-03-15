import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { FavoritesResponse } from './favorite.interface';
import { TrackService } from '../tracks/track.service';
import { Artist } from '../artists/artist.interface';
import { Album } from '../albums/album.interface';
import { Track } from '../tracks/track.interface';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artists/artist.service';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const artists: Artist[] = await this.artistService.getAllFavorited();
    const albums: Album[] = await this.albumService.getAllFavorited();
    const tracks: Track[] = await this.trackService.getAllFavorited();

    return { artists, albums, tracks };
  }

  async addTrack(trackId: string) {
    await this.trackService.assertExistById(
      trackId,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    await this.trackService.changeFavoriteById(trackId, true);
  }

  async removeTrack(trackId: string) {
    await this.trackService.assertExistById(
      trackId,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    await this.trackService.changeFavoriteById(trackId, false);
  }

  async addAlbum(id: string) {
    await this.albumService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    await this.albumService.changeFavoriteById(id, true);
  }

  async removeAlbum(id: string) {
    await this.albumService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    await this.albumService.changeFavoriteById(id, false);
  }

  async addArtist(id: string) {
    await this.artistService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    await this.artistService.changeFavoriteById(id, true);
  }

  async removeArtist(id: string) {
    await this.artistService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    await this.artistService.changeFavoriteById(id, false);
  }
}
