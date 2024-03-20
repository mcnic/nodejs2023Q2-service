import { validate as uuidValidate, v4 } from 'uuid';

export const isValidUUID = (uuid: string): boolean => {
  return uuidValidate(uuid);
};

export const newUUID = (): string => {
  return v4();
};
