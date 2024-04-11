export interface Password {
  cryptPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}
