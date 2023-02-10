import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  cod_endereco: number;
  cod_conta: number;
}

@injectable()
export class AccountChangeDefaultAddressUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ cod_conta, cod_endereco }: IRequest) {
    const result = await connection.raw(`
      SELECT * FROM CONTA_ENDERECOS WHERE cod_endereco = '${cod_endereco}'
    `);

    if (result.length <= 0) {
      throw new HttpError('account/change-default-address.invalid-address');
    }

    if (result[0].cod_conta !== cod_conta) {
      throw new HttpError('account/change-default-address.no-permission');
    }

    await connection.raw(`
      UPDATE CONTA_ENDERECOS SET "default" = 0 WHERE cod_conta = '${cod_conta}';

      UPDATE CONTA_ENDERECOS SET "default" = 1 WHERE cod_endereco = '${cod_endereco}';
    `);
  }
}
