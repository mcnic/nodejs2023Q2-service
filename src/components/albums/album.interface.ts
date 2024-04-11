import { IsNotEmpty, IsNumber } from 'class-validator';

export class Album {
  id: string; // uuid v4
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  year: number;
  artistId: string | null; // refers to Artist
}
