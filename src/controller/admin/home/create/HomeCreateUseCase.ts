import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

import { IHomeCreateDTO } from './dto/IHomeCreateDTO';

type IRequest = IHomeCreateDTO;

@injectable()
export class HomeCreateUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute(data: IRequest) {
    const type = await connection.raw(
      `
      SELECT * FROM HOME_TIPO WHERE id_tipo = :id_tipo
    `,
      { id_tipo: data.id_tipo },
    );

    if (type.length <= 0) {
      throw new HttpError('[ADMIN]/home/create.invalid-home-type');
    }

    await connection.raw(
      `
        INSERT INTO HOME
        ("id_tipo", "imagem", "status", "ordem", "rota", "descricao")
        VALUES
        (:id_tipo, :imagem, :status, :ordem, :rota, :descricao)
      `,
      {
        id_tipo: data.id_tipo,
        imagem: data.imagem,
        status: 1,
        ordem: data.ordem,
        rota: data.rota,
        descricao: data.descricao,
      },
    );

    return data;
  }
}
