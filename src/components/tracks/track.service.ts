import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.interface';
import { newUUID } from 'src/helpers/uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async assertExistById(id: string, status: HttpStatus = HttpStatus.NOT_FOUND) {
    const track = await this.prisma.track.findFirst({
      where: { id },
    });

    if (!track) throw new HttpException('Track not found', status);
  }

  async getAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async getAllFavorited(): Promise<Track[]> {
    return await this.prisma.track.findMany({
      where: { favorite: true },
    });
  }

  async getById(id: string): Promise<Track | undefined> {
    const track = await this.prisma.track.findFirst({
      where: { id },
    });

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async add(dto: Track): Promise<Track> {
    const { name, duration, artistId, albumId } = dto;

    const newTrack = await this.prisma.track.create({
      data: {
        id: newUUID(),
        name,
        artistId,
        albumId,
        duration,
      },
    });

    return newTrack;
  }

  async changeById(id: string, dto: Track): Promise<Track> {
    await this.assertExistById(id);

    return await this.prisma.track.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async removeById(id: string) {
    await this.assertExistById(id);

    await this.prisma.track.delete({
      where: { id },
    });
  }

  async removeAlbumFromAllTracks(id: string) {
    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: {
        albumId: null,
      },
    });
  }

  async removeArtistFromAllTracks(id: string) {
    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: {
        artistId: null,
      },
    });
  }

  async changeFavoriteById(id: string, favorite: boolean) {
    await this.assertExistById(id);

    await this.prisma.track.update({
      where: { id },
      data: {
        favorite,
      },
    });
  }
}
