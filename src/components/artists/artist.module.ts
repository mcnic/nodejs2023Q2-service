import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { MemoryDbProvider } from 'src/db/memoryStore';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService, TrackService, MemoryDbProvider],
})
export class ArtistModule {}
