import { IsNotEmpty, IsNumber } from 'class-validator';

export class Track {
  id: string; // uuid v4
  @IsNotEmpty()
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  @IsNotEmpty()
  @IsNumber()
  duration: number; // integer number
}
