import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  id_home: number;
  id_tipo: number;
  image: string;
  status: number;
  description: string;
  route: string;
  order: number;
}

@injectable()
export class HomeUpdateUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute(data: IRequest) {
    const result = await connection.raw(
      `
      SELECT * FROM HOME WHERE id_home = :id_home
    `,
      {
        id_home: data.id_home,
      },
    );

    if (result.length <= 0) {
      throw new HttpError('[ADMIN]/home/update.invalid-home');
    }

    await connection.raw(
      `
      UPDATE HOME SET
      
      id_tipo = :id_tipo,
      status = :status,
      imagem = :image,
      ordem = :order,
      descricao = :description,
      rota = :route

      WHERE
        id_home = :id_home
    `,
      {
        id_tipo: data.id_tipo,
        image: data.image,
        order: data.order,
        description: data.description,
        route: data.route,
        status: data.status,
      },
    );
  }
}
