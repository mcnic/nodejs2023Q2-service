import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { MemoryDbProvider } from 'src/db/memoryStore';
import { TrackService } from '../tracks/track.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, TrackService, MemoryDbProvider],
})
export class AlbumModule {}
