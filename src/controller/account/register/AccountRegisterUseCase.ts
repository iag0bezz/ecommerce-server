import { auth } from '@config/auth';
import { connection } from 'database';
import { Account, IAccount } from 'database/model/account';
import { inject, injectable } from 'tsyringe';

import { CredentialsProvider } from '@shared/container/provider/CredentialsProvider';
import { HashProvider } from '@shared/container/provider/HashProvider';
import { TokenProvider } from '@shared/container/provider/TokenProvider';
import { HttpError } from '@shared/error/HttpError';

import { IAccountRegisterDTO } from './dto/IAccountRegisterDTO';

type IRequest = IAccountRegisterDTO;

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
export class AccountRegisterUseCase {
  constructor(
    @inject('HashProvider') private hashProvider: HashProvider,
    @inject('TokenProvider') private tokenProvider: TokenProvider,
    @inject('CredentialsProvider')
    private credentialsProvider: CredentialsProvider,
  ) {}

  async execute({
    email,
    password,
    name,
    cpf_cnpj,
    provider,
    uid,
    token,
    phone,
  }: IRequest): Promise<IResponse> {
    const result = await connection.raw(
      `SELECT * FROM CONTA WHERE email = '${email}' OR cpf_cnpj = '${cpf_cnpj}' OR telefone = '${phone}'`,
    );

    let account = result[0];

    if (provider && uid && token) {
      const verifyToken = await this.credentialsProvider.verify(
        provider,
        token,
      );

      if (!verifyToken.success) {
        throw new HttpError('account/register.invalid-social-login');
      }

      if (!account) {
        account = await connection
          .insert({
            email,
            nome: name,
            telefone: phone,
          })
          .into('CONTA')
          .returning('*');
      }

      if (account.length > 0) {
        await connection.raw(`
          IF NOT EXISTS (SELECT * FROM CONTA_PROVEDORES AP WHERE AP.uid = '${uid}')
            INSERT INTO CONTA_PROVEDORES ("uid", "provedor", "cod_conta") VALUES ('${uid}', '${provider}', ${account[0].cod_conta})
          ELSE
            UPDATE AP SET AP.provedor = '${provider}' FROM CONTA_PROVEDORES AP WHERE uid = '${uid}'
        `);

        const access_token = await this.generateAccessToken(account[0]);

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

      throw new HttpError('account/register.invalid-social-account');
    } else {
      if (account) {
        throw new HttpError('account/register.account-already-exists');
      }

      const passwordHash = await this.hashProvider.hash(password);

      account = await Account.insert({
        email,
        nome: name,
        senha: passwordHash,
        cpf_cnpj,
        telefone: phone,
      }).returning('*');

      if (account.length <= 0) {
        throw new HttpError('account/register.invalid-account');
      }

      const access_token = await this.generateAccessToken(account[0]);

      return {
        access_token,
        account: {
          id: account[0].cod_conta,
          name: account[0].nome,
          email: account[0].email,
          cpf_cnpj: account[0].cpf_cnpj,
          phone: account[0].telefone,
        },
      };
    }
  }

  private async generateAccessToken(account: IAccount): Promise<string> {
    return this.tokenProvider.sign(
      { id: account.cod_conta.toString(), email: account.email },
      account.cod_conta.toString(),
      auth.secret_key,
      auth.expiration,
    );
  }
}
