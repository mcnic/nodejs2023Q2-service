import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Artist } from './artist.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';

@Injectable()
export class ArtistService {
  artists: Artist[] = [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      name: 'artist1',
      grammy: false,
    },
  ];

  assertArtistId(id: string) {
    if (!isValidUUID(id))
      throw new HttpException(
        'id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
  }

  async assertArtistExistById(id: string) {
    const artist = await this.isArtistExist(id);

    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async isArtistExist(artistId: string): Promise<boolean> {
    return !!this.artists.find(({ id }) => id === artistId);
  }

  async getArtistById(artistId: string): Promise<Artist | undefined> {
    this.assertArtistId(artistId);

    const artist = this.artists.find(({ id }) => id === artistId);

    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return artist;
  }

  async addArtist(dto: Artist): Promise<Artist> {
    const { name, grammy } = dto;

    if (!name || typeof name !== 'string' || grammy === undefined)
      throw new HttpException('Invalid Artist data', HttpStatus.BAD_REQUEST);

    const newArtist: Artist = {
      id: newUUID(),
      name,
      grammy: Boolean(grammy),
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  async changeArtistById(id: string, dto: Artist): Promise<Artist> {
    const { name, grammy } = dto;

    this.assertArtistId(id);
    await this.assertArtistExistById(id);

    if (!name || typeof name !== 'string' || grammy === undefined)
      throw new HttpException('Invalid Artist data', HttpStatus.BAD_REQUEST);

    let artist = this.getArtistById(id);
    artist = {
      id,
      ...artist,
      ...dto,
    };

    return artist;
  }

  async removeArtistdById(artistId: string) {
    this.assertArtistId(artistId);
    await this.assertArtistExistById(artistId);

    this.artists = this.artists.filter(({ id }) => id !== artistId);
  }
}
