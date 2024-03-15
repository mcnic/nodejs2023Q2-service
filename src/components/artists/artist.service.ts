import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { newUUID } from 'src/helpers/uuid';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    private prisma: PrismaService,
  ) {}

  async assertExistById(id: string, status: HttpStatus = HttpStatus.NOT_FOUND) {
    const artist = await this.isExist(id);

    if (!artist) throw new HttpException('Artist not found', status);
  }

  private async assertIsCorrect(id: string) {
    await this.assertExistById(id);
  }

  async getAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async getAllFavorited(): Promise<Artist[]> {
    return await this.prisma.artist.findMany({
      where: { favorite: true },
    });
  }

  async isExist(id: string): Promise<boolean> {
    const artist = await this.prisma.artist.findFirst({
      where: { id },
    });

    return !!artist;
  }

  async getById(id: string): Promise<Artist | undefined> {
    const artist = await this.prisma.artist.findFirst({
      where: { id },
    });

    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async add(dto: Artist): Promise<Artist> {
    const { name, grammy } = dto;

    const newArtist = await this.prisma.artist.create({
      data: {
        id: newUUID(),
        name,
        grammy: Boolean(grammy),
      },
    });

    return newArtist;
  }

  async changeById(id: string, dto: Artist): Promise<Artist> {
    await this.assertExistById(id);

    return await this.prisma.artist.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async removeById(id: string) {
    await this.assertExistById(id);

    await this.prisma.artist.delete({
      where: { id },
    });

    await this.trackService.removeArtistFromAllTracks(id);

    await this.albumService.removeArtistFromAllAlbums(id);
  }

  async changeFavoriteById(id: string, favorite: boolean) {
    await this.assertExistById(id);

    await this.prisma.artist.update({
      where: { id },
      data: {
        favorite,
      },
    });
  }
}
