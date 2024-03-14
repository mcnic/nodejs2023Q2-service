import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { MemoryDbProvider } from 'src/db/memoryStore';

@Module({
  controllers: [TrackController],
  providers: [TrackService, MemoryDbProvider],
  exports: [TrackService],
})
export class TrackModule {}
