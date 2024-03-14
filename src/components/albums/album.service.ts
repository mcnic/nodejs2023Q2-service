import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Album } from './album.interface';
import { newUUID } from 'src/helpers/uuid';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(MEMORY_STORE) private readonly store: MemoryStore,
  ) {}

  async assertExistById(id: string, status: HttpStatus = HttpStatus.NOT_FOUND) {
    const album = await this.isExist(id);

    if (!album) throw new HttpException('Album not found', status);
  }

  private async assertAlbumIsCorrect(id: string) {
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
    const store = await this.store.getStore();
    const album = store.albums.find(({ id }) => id === albumId);

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async add(dto: Album): Promise<Album> {
    const { name, year, artistId } = dto;

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
    await this.assertExistById(id);

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
    await this.assertExistById(albumId);

    const store = await this.store.getStore();
    const albums = store.albums.filter(({ id }) => id !== albumId);
    await this.store.setStore({ ...store, albums });

    await this.trackService.removeAlbumFromAllTracks(albumId);
  }

  async removeArtistFromAllAlbums(id: string) {
    const store = await this.store.getStore();
    const albums = store.albums.map((album) => {
      if (album.artistId === id) album.artistId = null;
      return album;
    });
    await this.store.setStore({ ...store, albums });
  }
}
