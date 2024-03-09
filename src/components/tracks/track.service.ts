import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Track } from './track.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';

@Injectable()
export class TrackService {
  constructor(@Inject(MEMORY_STORE) private readonly store: MemoryStore) {}

  assertId(id: string) {
    if (!isValidUUID(id))
      throw new HttpException(
        'id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
  }

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
    this.assertId(trackId);

    const store = await this.store.getStore();

    const track = store.tracks.find(({ id }) => id === trackId);

    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    return track;
  }

  async add(dto: Track): Promise<Track> {
    const { name, duration, artistId, albumId } = dto;

    if (
      !name ||
      !duration ||
      typeof name !== 'string' ||
      typeof duration !== 'number'
    )
      throw new HttpException('Invalid Track data', HttpStatus.BAD_REQUEST);

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
    const { name, duration } = dto;

    this.assertId(id);
    await this.assertExistById(id);

    if (
      !name ||
      !duration ||
      typeof name !== 'string' ||
      typeof duration !== 'number'
    )
      throw new HttpException('Invalid Track data', HttpStatus.BAD_REQUEST);

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
    this.assertId(trackId);
    await this.assertExistById(trackId);

    const store = await this.store.getStore();
    const tracks = store.tracks.filter(({ id }) => id !== trackId);
    await this.store.setStore({ ...store, tracks });
  }
}
