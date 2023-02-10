import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

import { IAccountCreateAddressDTO } from './dto/AccountCreateAddressDTO';

interface IRequest {
  account_id: number;
  data: IAccountCreateAddressDTO;
}

type IResponse = IRequest;

@injectable()
export class AccountCreateAddressUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ account_id, data }: IRequest): Promise<IResponse> {
    await connection.raw(`
      INSERT INTO CONTA_ENDERECOS 
        ("cod_conta", "cep", "rua", "bairro", "cidade", "uf", "numero", "complemento", "tipo")
        VALUES
        ('${account_id}', '${data.cep}', '${data.logradouro}', '${data.bairro}', '${data.cidade}', '${data.uf}', '${data.numero}', '${data.complemento}', '${data.tipo}')
    `);

    return {
      account_id,
      data,
    };
  }
}
