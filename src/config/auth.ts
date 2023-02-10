export interface IAuthOptions {
  secret_key: string;
  expiration: string;
}

export const auth = {
  secret_key: process.env.AUTH_SECRET_KEY ?? 'secretKey',
  expiration: process.env.AUTH_EXPIRATION ?? '7d',
} as IAuthOptions;
