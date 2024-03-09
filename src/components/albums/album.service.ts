import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Album } from './album.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class AlbumService {
  constructor(
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
    const album = await this.isExist(id);

    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
  }

  async assertAlbumIsCorrect(id: string) {
    this.assertId(id);
    await this.assertExistById(id);
  }

  async getAll(): Promise<Album[]> {
    const store = await this.store.getStore();

    return store.albums;
  }

  async isExist(albumId: string): Promise<boolean> {
    const store = await this.store.getStore();

    return !!store.albums.find(({ id }) => id === albumId);
  }

  async getById(albumId: string): Promise<Album | undefined> {
    this.assertId(albumId);

    const store = await this.store.getStore();
    const album = store.albums.find(({ id }) => id === albumId);

    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    return album;
  }

  async add(dto: Album): Promise<Album> {
    const { name, year, artistId } = dto;

    if (
      !name ||
      typeof name !== 'string' ||
      !year ||
      typeof year !== 'number' ||
      artistId === undefined
    )
      throw new HttpException('Invalid Album data', HttpStatus.BAD_REQUEST);

    const store = await this.store.getStore();
    const albums = store.albums;
    const newAlbum: Album = {
      id: newUUID(),
      name,
      year,
      artistId,
    };
    albums.push(newAlbum);
    await this.store.setStore({ ...store, albums });

    return newAlbum;
  }

  async changeById(id: string, dto: Album): Promise<Album> {
    const { name, year, artistId } = dto;

    this.assertId(id);
    await this.assertExistById(id);

    if (
      !name ||
      typeof name !== 'string' ||
      !year ||
      typeof year !== 'number' ||
      artistId === undefined
    )
      throw new HttpException('Invalid Album data', HttpStatus.BAD_REQUEST);

    let changedAlbum: Album;

    const store = await this.store.getStore();
    const albums = store.albums.map((album) => {
      if (album.id === id) {
        changedAlbum = {
          ...album,
          ...dto,
        };
        return changedAlbum;
      }
      return album;
    });
    await this.store.setStore({ ...store, albums });

    return changedAlbum;
  }

  async removedById(albumId: string) {
    this.assertId(albumId);
    await this.assertExistById(albumId);

    const store = await this.store.getStore();
    const albums = store.albums.filter(({ id }) => id !== albumId);
    await this.store.setStore({ ...store, albums });

    await this.trackService.removeAlbumFromAllTracks(albumId);
  }
}
