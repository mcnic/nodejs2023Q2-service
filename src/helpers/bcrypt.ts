import * as bcrypt from 'bcrypt';

export const getHash = async (password: string, salt: string) =>
  await bcrypt.hash(password, salt);

export const genSalt = async (saltRound: number) =>
  await bcrypt.genSalt(saltRound);

export const isMatch = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);
