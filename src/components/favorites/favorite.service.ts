import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FavoritesResponse } from './favorite.interface';
import { TrackService } from '../tracks/track.service';
import { Artist } from '../artists/artist.interface';
import { Album } from '../albums/album.interface';
import { Track } from '../tracks/track.interface';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artists/artist.service';
import { MEMORY_STORE, MemoryStore } from 'src/db/memoryStore';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    @Inject(MEMORY_STORE) private readonly store: MemoryStore,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const store = await this.store.getStore();

    const artists: Artist[] = (await this.artistService.getAll()).filter(
      ({ id }) => store.favorites.artists.includes(id),
    );
    const albums: Album[] = (await this.albumService.getAll()).filter(
      ({ id }) => store.favorites.albums.includes(id),
    );
    const tracks: Track[] = (await this.trackService.getAll()).filter(
      ({ id }) => store.favorites.tracks.includes(id),
    );

    return { artists, albums, tracks };
  }

  async addTrack(trackId: string) {
    this.trackService.assertId(trackId);
    await this.trackService.assertExistById(
      trackId,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const store = await this.store.getStore();
    const favorites = store.favorites;
    favorites.tracks.push(trackId);
    await this.store.setStore({ ...store, favorites });
  }

  async removeTrack(trackId: string) {
    this.trackService.assertId(trackId);
    await this.trackService.assertExistById(
      trackId,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const store = await this.store.getStore();
    const tracks = store.favorites.tracks.filter((id) => id !== trackId);
    await this.store.setStore({
      ...store,
      favorites: { ...store.favorites, tracks },
    });
  }

  async addAlbum(id: string) {
    await this.albumService.assertId(id);
    await this.albumService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const store = await this.store.getStore();
    const favorites = store.favorites;
    favorites.albums.push(id);
    await this.store.setStore({ ...store, favorites });
  }

  async removeAlbum(id: string) {
    await this.albumService.assertId(id);
    await this.albumService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const store = await this.store.getStore();
    const albums = store.favorites.albums.filter((albumId) => albumId !== id);
    await this.store.setStore({
      ...store,
      favorites: { ...store.favorites, albums },
    });
  }

  async addArtist(id: string) {
    this.artistService.assertId(id);
    await this.artistService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const store = await this.store.getStore();
    const favorites = store.favorites;
    favorites.artists.push(id);
    await this.store.setStore({ ...store, favorites });
  }

  async removeArtist(id: string) {
    this.artistService.assertId(id);
    await this.artistService.assertExistById(
      id,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    const store = await this.store.getStore();
    const artists = store.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    await this.store.setStore({
      ...store,
      favorites: { ...store.favorites, artists },
    });
  }
}
