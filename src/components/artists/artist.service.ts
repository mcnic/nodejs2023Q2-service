import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Artist } from './artist.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    @Inject(MEMORY_STORE) private readonly store: MemoryStore,
  ) {}

  assertId(id: string) {
    if (!isValidUUID(id))
      throw new HttpException(
        'id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
  }

  async assertExistById(id: string) {
    const artist = await this.isExist(id);

    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
  }

  async assertIsCorrect(id: string) {
    this.assertId(id);
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
    this.assertId(artistId);

    const store = await this.store.getStore();
    const artist = store.artists.find(({ id }) => id === artistId);

    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return artist;
  }

  async add(dto: Artist): Promise<Artist> {
    const { name, grammy } = dto;

    if (!name || typeof name !== 'string' || grammy === undefined)
      throw new HttpException('Invalid Artist data', HttpStatus.BAD_REQUEST);

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
    const { name, grammy } = dto;

    this.assertId(id);
    await this.assertExistById(id);

    if (!name || typeof name !== 'string' || grammy === undefined)
      throw new HttpException('Invalid Artist data', HttpStatus.BAD_REQUEST);

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
    this.assertId(artistId);
    await this.assertExistById(artistId);

    const store = await this.store.getStore();
    const artists = store.artists.filter(({ id }) => id !== artistId);
    await this.store.setStore({ ...store, artists });

    await this.trackService.removeArtistFromAllTracks(artistId);

    await this.albumService.removeArtistFromAllAlbums(artistId);
  }
}
