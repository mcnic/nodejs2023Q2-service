import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track } from './track.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';

@Injectable()
export class TrackService {
  tracks: Track[] = [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      name: 'track1',
      artistId: 'artist1',
      albumId: 'albom1',
      duration: 1,
    },
  ];

  assertTrackId(id: string) {
    if (!isValidUUID(id))
      throw new HttpException(
        'id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
  }

  async assertTrackExistById(id: string) {
    const Track = await this.isTrackExist(id);

    if (!Track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
  }

  async getAll(): Promise<Track[]> {
    return this.tracks;
  }

  async isTrackExist(trackId: string): Promise<boolean> {
    return !!this.tracks.find(({ id }) => id === trackId);
  }

  async getById(trackId: string): Promise<Track | undefined> {
    this.assertTrackId(trackId);

    const track = this.tracks.find(({ id }) => id === trackId);

    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    return track;
  }

  async addTrack(dto: Track): Promise<Track> {
    const { name, duration, artistId, albumId } = dto;

    if (
      !name ||
      !duration ||
      typeof name !== 'string' ||
      typeof duration !== 'number'
    )
      throw new HttpException('Invalid Track data', HttpStatus.BAD_REQUEST);

    const newTrack: Track = {
      id: newUUID(),
      name,
      artistId,
      albumId,
      duration,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  async changeById(id: string, dto: Track): Promise<Track> {
    const { name, duration } = dto;

    this.assertTrackId(id);
    await this.assertTrackExistById(id);

    if (
      !name ||
      !duration ||
      typeof name !== 'string' ||
      typeof duration !== 'number'
    )
      throw new HttpException('Invalid Track data', HttpStatus.BAD_REQUEST);

    let track = this.getById(id);
    track = {
      id,
      ...track,
      ...dto,
    };

    return track;
  }

  async removeById(trackId: string) {
    this.assertTrackId(trackId);
    await this.assertTrackExistById(trackId);

    this.tracks = this.tracks.filter(({ id }) => id !== trackId);
  }
}
