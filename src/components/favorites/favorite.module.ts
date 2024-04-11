import { Module } from '@nestjs/common';
import { FavoriteController } from './favotite.controller';
import { FavoriteService } from './favorite.service';
import { TrackService } from '../tracks/track.service';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artists/artist.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, TrackService, AlbumService, ArtistService],
  imports: [PrismaModule],
})
export class FavoriteModule {}
