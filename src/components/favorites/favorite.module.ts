import { Module } from '@nestjs/common';
import { FavoriteController } from './favotite.controller';
import { FavoriteService } from './favorite.service';
import { TrackService } from '../tracks/track.service';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artists/artist.service';
import { MemoryDbProvider } from 'src/db/memoryStore';

@Module({
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    TrackService,
    AlbumService,
    ArtistService,
    MemoryDbProvider,
  ],
})
export class FavoriteModule {}
