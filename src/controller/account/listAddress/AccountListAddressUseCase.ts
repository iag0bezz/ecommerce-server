import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

interface IRequest {
  cod_conta: number;
}

@injectable()
export class AccountListAddressUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ cod_conta }: IRequest) {
    const results = await connection.raw(`
      SELECT * FROM CONTA_ENDERECOS WHERE cod_conta = '${cod_conta}'
    `);

    return results.map(value => {
      return {
        ...value,
        default: value.default > 0,
      };
    });
  }
}
