import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

import { IAccountCreateAddressDTO } from '../createAddress/dto/AccountCreateAddressDTO';

interface IRequest {
  cod_endereco: number;
  cod_conta: number;
  data: IAccountCreateAddressDTO;
}

@injectable()
export class AccountUpdateAddressUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ cod_endereco, cod_conta, data }: IRequest) {
    const result = await connection.raw(`
      SELECT * FROM CONTA_ENDERECOS WHERE cod_endereco = '${cod_endereco}'
    `);

    if (result.length <= 0) {
      throw new HttpError('account/update-address.invalid-address', 404);
    }

    if (result[0].cod_conta !== cod_conta) {
      throw new HttpError('account/update-address.no-permission');
    }

    await connection.raw(`
      UPDATE CONTA_ENDERECOS SET
        cep = '${data.cep}',
        rua = '${data.logradouro}',
        bairro = '${data.bairro}',
        cidade = '${data.cidade}',
        uf = '${data.uf}',
        numero = '${data.numero}',
        complemento = '${data.complemento}',
        tipo = '${data.tipo}'
      WHERE cod_endereco = '${cod_endereco}'
    `);

    return {
      cod_endereco,
      cod_conta,
      ...data,
      default: result[0].default === 1,
    };
  }
}
