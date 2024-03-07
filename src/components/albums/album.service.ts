import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from './album.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';

@Injectable()
export class AlbumService {
  albums: Album[] = [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      name: 'album1',
      year: 2020,
      artistId: null,
    },
  ];

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

  async getAll(): Promise<Album[]> {
    return this.albums;
  }

  async isExist(albumId: string): Promise<boolean> {
    return !!this.albums.find(({ id }) => id === albumId);
  }

  async getById(albumId: string): Promise<Album | undefined> {
    this.assertId(albumId);

    const album = this.albums.find(({ id }) => id === albumId);

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

    const newAlbum: Album = {
      id: newUUID(),
      name,
      year,
      artistId,
    };

    this.albums.push(newAlbum);

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

    let album = this.getById(id);
    album = {
      id,
      ...album,
      ...dto,
    };

    return album;
  }

  async removedById(albumId: string) {
    this.assertId(albumId);
    await this.assertExistById(albumId);

    this.albums = this.albums.filter(({ id }) => id !== albumId);
  }
}
