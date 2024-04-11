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
import { TrackService } from '../tracks/track.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    private prisma: PrismaService,
  ) {}

  async assertExistById(id: string, status: HttpStatus = HttpStatus.NOT_FOUND) {
    const album = await this.isExist(id);

    if (!album) throw new HttpException('Album not found', status);
  }

  async getAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async getAllFavorited(): Promise<Album[]> {
    return await this.prisma.album.findMany({
      where: { favorite: true },
    });
  }
  async isExist(id: string): Promise<boolean> {
    const album = await this.prisma.album.findFirst({
      where: { id },
    });

    return !!album;
  }

  async getById(id: string): Promise<Album | undefined> {
    const album = await this.prisma.album.findFirst({
      where: { id },
    });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async add(dto: Album): Promise<Album> {
    const { name, year, artistId } = dto;

    const newAlbum = await this.prisma.album.create({
      data: {
        id: newUUID(),
        name,
        year,
        artistId,
      },
    });

    return newAlbum;
  }

  async changeById(id: string, dto: Album): Promise<Album> {
    await this.assertExistById(id);

    return await this.prisma.album.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async removedById(id: string) {
    await this.assertExistById(id);

    await this.prisma.album.delete({
      where: { id },
    });

    await this.trackService.removeAlbumFromAllTracks(id);
  }

  async removeArtistFromAllAlbums(id: string) {
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: {
        artistId: null,
      },
    });
  }

  async changeFavoriteById(id: string, favorite: boolean) {
    await this.assertExistById(id);

    await this.prisma.album.update({
      where: { id },
      data: {
        favorite,
      },
    });
  }
}
