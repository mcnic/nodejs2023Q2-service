export interface RefreshTokenResponse {
  refreshToken: string;
  token: string;
}

export interface AuthSingnupResponse {
  id: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
}
