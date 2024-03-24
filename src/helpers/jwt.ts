import { RefreshTokenResponse } from 'src/components/auth/auth.interface';

export const getToken = async (): Promise<string> => {
  return 'token';
};

export const getNewToken = async (
  oldToken: string,
): Promise<RefreshTokenResponse> => {
  return {
    token: oldToken,
    refreshToken: 'refreshToken',
  };
};
