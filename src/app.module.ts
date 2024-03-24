import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './components/users/user.module';
import { TrackModule } from './components/tracks/track.module';
import { ArtistModule } from './components/artists/artist.module';
import { AlbumModule } from './components/albums/album.module';
import { FavoriteModule } from './components/favorites/favorite.module';
import { LoggerModule } from './components/logger/logger.module';
import { LogQueryMiddleware } from './middlewares/logQuery.meddleware';
import { AuthModule } from './components/auth/auth.module';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoriteModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogQueryMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
