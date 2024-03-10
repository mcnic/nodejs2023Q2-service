import { Album } from 'src/components/albums/album.interface';
import { Artist } from 'src/components/artists/artist.interface';
import { Favorites } from 'src/components/favorites/favorite.interface';
import { Track } from 'src/components/tracks/track.interface';
import { User } from 'src/components/user.interface';

export interface Store {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: Favorites;
}

export class MemoryStore {
  private static instance: MemoryStore;
  store: Store = {
    users: [],
    artists: [],
    albums: [],
    tracks: [],
    favorites: { artists: [], albums: [], tracks: [] },
  };

  public static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }

    return MemoryStore.instance;
  }

  async getStore(): Promise<Store> {
    return new Promise((res) => {
      res(this.store);
    });
  }

  async setStore(newStore: Store) {
    this.store = { ...newStore };
  }
}

export const MEMORY_STORE = 'MemoryStore';

export const MemoryDbProvider = {
  provide: MEMORY_STORE,
  useFactory: () => MemoryStore.getInstance(),
};
