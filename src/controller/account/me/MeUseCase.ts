import { connection } from 'database';
import { injectable } from 'tsyringe';

import { HttpError } from '@shared/error/HttpError';

import { IMeDTO } from './dto/IMeDTO';

type IRequest = IMeDTO;

interface IResponse {
  id: number;
  name: string;
  email: string;
  cpf_cnpj: string;
  phone: string;
}

@injectable()
export class MeUseCase {
  async execute({ id }: IRequest): Promise<IResponse> {
    const result = await connection.raw(
      `SELECT * FROM CONTA WHERE cod_conta = ${id}`,
    );

    if (result.length <= 0) {
      throw new HttpError('account/me.invalid-account');
    }

    const user = result[0];

    return {
      id: user.cod_conta,
      name: user.nome,
      email: user.email,
      cpf_cnpj: user.cpf_cnpj,
      phone: user.telefone,
    };
  }
}
