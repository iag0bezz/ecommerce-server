import { sign, verify } from 'jsonwebtoken';

export class TokenProvider {
  async sign(
    data: unknown,
    subject: string,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    const token = sign({ data }, secret, {
      subject,
      expiresIn,
    });

    return token;
  }

  async verify(token: string, secret: string): Promise<{ sub: string }> {
    try {
      const { sub } = verify(token, secret) as { sub: string };

      return { sub };
    } catch {
      throw new Error('token-provider.invalid-verify-token');
    }
  }
}
