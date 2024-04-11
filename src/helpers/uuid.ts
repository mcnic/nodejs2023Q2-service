import { v4 } from 'uuid';

export const newUUID = (): string => {
  return v4();
};
