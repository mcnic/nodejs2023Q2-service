import { Module } from '@nestjs/common';
import { FavoriteController } from './favotite.controller';
import { FavoriteService } from './favorite.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrackModule } from '../tracks/track.module';
import { AlbumModule } from '../albums/album.module';
import { ArtistModule } from '../artists/artist.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [PrismaModule, TrackModule, AlbumModule, ArtistModule],
})
export class FavoriteModule {}
