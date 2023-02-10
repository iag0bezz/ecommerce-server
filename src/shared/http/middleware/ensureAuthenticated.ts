import { auth } from '@config/auth';
import { connection } from 'database';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import { TokenProvider } from '@shared/container/provider/TokenProvider';
import { HttpError } from '@shared/error/HttpError';

export async function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const auth_header = request.headers.authorization;

  if (!auth_header) {
    throw new HttpError('authorization.invalid-token-provided', 401);
  }

  const [, token] = auth_header.split(' ');

  const tokenProvider = container.resolve<TokenProvider>('TokenProvider');

  try {
    const { sub: id } = await tokenProvider.verify(token, auth.secret_key);

    const result = await connection.raw(`
      SELECT * FROM CONTA WHERE cod_conta = ${id}
    `);

    if (result.length <= 0) {
      throw new HttpError('authorization.invalid-token', 401);
    }

    request.user = {
      id: result[0].cod_conta,
    };

    next();
  } catch {
    throw new HttpError('authorization.invalid-token', 401);
  }
}
