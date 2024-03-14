import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { newUUID } from 'src/helpers/uuid';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(MEMORY_STORE) private readonly store: MemoryStore,
  ) {}

  async assertExistById(id: string, status: HttpStatus = HttpStatus.NOT_FOUND) {
    const artist = await this.isExist(id);

    if (!artist) throw new HttpException('Artist not found', status);
  }

  private async assertIsCorrect(id: string) {
    await this.assertExistById(id);
  }

  async getAll(): Promise<Artist[]> {
    const store = await this.store.getStore();

    return store.artists;
  }

  async isExist(artistId: string): Promise<boolean> {
    const store = await this.store.getStore();

    return !!store.artists.find(({ id }) => id === artistId);
  }

  async getById(artistId: string): Promise<Artist | undefined> {
    const store = await this.store.getStore();
    const artist = store.artists.find(({ id }) => id === artistId);

    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async add(dto: Artist): Promise<Artist> {
    const { name, grammy } = dto;

    const store = await this.store.getStore();
    const artists = store.artists;
    const newArtist: Artist = {
      id: newUUID(),
      name,
      grammy: Boolean(grammy),
    };
    artists.push(newArtist);
    await this.store.setStore({ ...store, artists });

    return newArtist;
  }

  async changeById(id: string, dto: Artist): Promise<Artist> {
    await this.assertExistById(id);

    let changedArtist: Artist;

    const store = await this.store.getStore();
    const artists = store.artists.map((artist) => {
      if (artist.id === id) {
        changedArtist = {
          ...artist,
          ...dto,
        };
        return changedArtist;
      }
      return artist;
    });
    await this.store.setStore({ ...store, artists });

    return changedArtist;
  }

  async removeById(artistId: string) {
    await this.assertExistById(artistId);

    const store = await this.store.getStore();
    const artists = store.artists.filter(({ id }) => id !== artistId);
    await this.store.setStore({ ...store, artists });

    await this.trackService.removeArtistFromAllTracks(artistId);

    await this.albumService.removeArtistFromAllAlbums(artistId);
  }
}
