export interface IJwtPayload {
  sub: string;
  exp: number;
}

export interface IJwtRefreshPayload extends IJwtPayload {
  refresh: boolean;
}
