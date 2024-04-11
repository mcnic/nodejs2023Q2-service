import { IsBoolean, IsNotEmpty } from 'class-validator';

export class Artist {
  id: string; // uuid v4
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
