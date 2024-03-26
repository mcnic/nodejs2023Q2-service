export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthSingnupResponse {
  id: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
}
