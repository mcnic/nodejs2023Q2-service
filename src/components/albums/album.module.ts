import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackService } from '../tracks/track.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, TrackService],
  imports: [PrismaModule],
})
export class AlbumModule {}
