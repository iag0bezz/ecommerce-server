import { auth } from '@config/auth';
import { connection } from 'database';
import { IAccount } from 'database/model/account';
import { container, inject, injectable } from 'tsyringe';

import { CredentialsProvider } from '@shared/container/provider/CredentialsProvider';
import { HashProvider } from '@shared/container/provider/HashProvider';
import { TokenProvider } from '@shared/container/provider/TokenProvider';
import { HttpError } from '@shared/error/HttpError';

import { AccountRegisterUseCase } from '../register/AccountRegisterUseCase';
import { IAccountLoginDTO } from './dto/IAccountLoginDTO';

type IRequest = IAccountLoginDTO;

interface IResponse {
  access_token: string;
  account: {
    id: number;
    name: string;
    email: string;
    cpf_cnpj: string;
    phone: string;
  };
}

@injectable()
export class AccountLoginUseCase {
  constructor(
    @inject('HashProvider') private hashProvider: HashProvider,
    @inject('TokenProvider') private tokenProvider: TokenProvider,
    @inject('CredentialsProvider')
    private credentialsProvider: CredentialsProvider,
  ) {}

  async execute({
    email,
    cpf_cnpj,
    provider,
    password,
    name,
    uid,
    token,
  }: IRequest): Promise<IResponse> {
    const result = await connection.raw(
      `SELECT * FROM CONTA WHERE email = '${email}' OR cpf_cnpj = '${cpf_cnpj}'`,
    );

    const account = result[0];

    if (provider && uid && token) {
      const verifyToken = await this.credentialsProvider.verify(
        provider,
        token,
      );

      if (!verifyToken.success) {
        throw new HttpError('account/login.invalid-social-login');
      }

      if (!account) {
        const accountRegisterUseCase = container.resolve(
          AccountRegisterUseCase,
        );

        return accountRegisterUseCase.execute({
          email,
          name,
          provider,
          uid,
          cpf_cnpj,
          password,
          token,
        });
      }

      const access_token = await this.generateAccessToken(account);

      return {
        access_token,
        account: {
          id: account.cod_conta,
          name: account.nome,
          email: account.email,
          cpf_cnpj: account.cpf_cnpj,
          phone: account.telefone,
        },
      };
    }

    if (!account) {
      throw new HttpError('account/login.invalid-credentials');
    }

    if (!account.senha) {
      throw new HttpError('account/login.invalid-credentials');
    }

    const passwordMatch = await this.hashProvider.compare(
      password,
      account.senha,
    );

    if (!passwordMatch) {
      throw new HttpError('account/login.invalid-credentials');
    }

    const access_token = await this.generateAccessToken(account);

    return {
      access_token,
      account: {
        id: account.cod_conta,
        name: account.nome,
        email: account.email,
        cpf_cnpj: account.cpf_cnpj,
        phone: account.telefone,
      },
    };
  }

  private async generateAccessToken(account: IAccount): Promise<string> {
    return this.tokenProvider.sign(
      { id: account.cod_conta.toString() },
      account.cod_conta.toString(),
      auth.secret_key,
      auth.expiration,
    );
  }
}
