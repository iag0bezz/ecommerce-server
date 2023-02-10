import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  cod_conta: number;
  cod_endereco: number;
}

@injectable()
export class AccountDeleteAddressUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ cod_conta, cod_endereco }: IRequest) {
    const result = await connection.raw(`
      SELECT * FROM CONTA_ENDERECOS WHERE cod_endereco = '${cod_endereco}'
    `);

    if (result.length <= 0) {
      throw new HttpError('account/address-delete.invalid-address');
    }

    const address = result[0];

    console.log(address);
    console.log(cod_conta);

    if (address.cod_conta !== cod_conta) {
      throw new HttpError('account/address-delete.no-permission');
    }

    await connection.raw(`
      DELETE FROM CONTA_ENDERECOS WHERE cod_endereco = '${cod_endereco}'
    `);

    return {
      ...address,
    };
  }
}
