import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.interface';
import { newUUID } from 'src/helpers/uuid';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';

@Injectable()
export class TrackService {
  constructor(@Inject(MEMORY_STORE) private readonly store: MemoryStore) {}

  async assertExistById(
    trackId: string,
    status: HttpStatus = HttpStatus.NOT_FOUND,
  ) {
    const store = await this.store.getStore();
    const track = store.tracks.find(({ id }) => id === trackId);

    if (!track) throw new HttpException('Track not found', status);
  }

  async getAll(): Promise<Track[]> {
    const store = await this.store.getStore();

    return store.tracks;
  }

  async getById(trackId: string): Promise<Track | undefined> {
    const store = await this.store.getStore();

    const track = store.tracks.find(({ id }) => id === trackId);

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async add(dto: Track): Promise<Track> {
    const { name, duration, artistId, albumId } = dto;

    const store = await this.store.getStore();
    const tracks = store.tracks;
    const newTrack: Track = {
      id: newUUID(),
      name,
      artistId,
      albumId,
      duration,
    };
    tracks.push(newTrack);
    await this.store.setStore({ ...store, tracks });

    return newTrack;
  }

  async changeById(id: string, dto: Track): Promise<Track> {
    await this.assertExistById(id);

    let changedTrack: Track;

    const store = await this.store.getStore();
    const tracks = store.tracks.map((track) => {
      if (track.id === id) {
        changedTrack = {
          ...track,
          ...dto,
        };
        return changedTrack;
      }
      return track;
    });
    await this.store.setStore({ ...store, tracks });

    return changedTrack;
  }

  async removeById(trackId: string) {
    await this.assertExistById(trackId);

    const store = await this.store.getStore();
    const tracks = store.tracks.filter(({ id }) => id !== trackId);
    await this.store.setStore({ ...store, tracks });
  }

  async removeAlbumFromAllTracks(id: string) {
    const store = await this.store.getStore();
    const tracks = store.tracks.map((track) => {
      if (track.albumId === id) track.albumId = null;
      return track;
    });
    await this.store.setStore({ ...store, tracks });
  }

  async removeArtistFromAllTracks(id: string) {
    const store = await this.store.getStore();
    const tracks = store.tracks.map((track) => {
      if (track.artistId === id) track.artistId = null;
      return track;
    });
    await this.store.setStore({ ...store, tracks });
  }
}
