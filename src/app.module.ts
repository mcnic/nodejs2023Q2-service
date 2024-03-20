import { Module } from '@nestjs/common';
import { UserModule } from './components/users/user.module';
import { TrackModule } from './components/tracks/track.module';
import { ArtistModule } from './components/artists/artist.module';
import { AlbumModule } from './components/albums/album.module';
import { FavoriteModule } from './components/favorites/favorite.module';

@Module({
  imports: [UserModule, TrackModule, ArtistModule, AlbumModule, FavoriteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
