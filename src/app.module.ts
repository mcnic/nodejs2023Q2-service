import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './components/users/user.module';
import { TrackModule } from './components/tracks/track.module';
import { ArtistModule } from './components/artists/artist.module';
import { AlbumModule } from './components/albums/album.module';
import { FavoriteModule } from './components/favorites/favorite.module';
import { LoggerModule } from './components/logger/logger.module';
import { LogQueryMiddleware } from './middlewares/logQuery.meddleware';
import { AuthModule } from './components/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './components/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoriteModule,
    LoggerModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogQueryMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
