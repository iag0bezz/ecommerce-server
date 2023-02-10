import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

interface IResponseStructureItem {
  id_home: number;
  image: string;
  order: number;
  route: string;
  description: string;
}

interface IResponseStructure {
  id_type: number;
  description: string;
  items: IResponseStructureItem[];
}

type IResponse = IResponseStructure[];

@injectable()
export class HomeListUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute(): Promise<IResponse> {
    const result = await connection.raw(`
      SELECT
        *
      FROM
        HOME H
      
      INNER JOIN HOME_TIPO HT
        ON HT.id_tipo = H.id_tipo

      WHERE
        H.status = 1
    `);

    const response: IResponseStructure[] = [];

    result.forEach(
      (data: {
        id_tipo: number;
        tipo_descricao: string;
        id_home: number;
        imagem: string;
        ordem: number;
        rota: string;
        description: string;
      }) => {
        const index = response.findIndex(
          value => value.id_type === data.id_tipo,
        );

        if (index === -1) {
          response.push({
            id_type: data.id_tipo,
            description: data.tipo_descricao,
            items: [
              {
                id_home: data.id_home,
                image: data.imagem,
                order: data.ordem,
                route: data.rota,
                description: data.description,
              },
            ],
          });
        } else {
          response[index].items.push({
            id_home: data.id_home,
            image: data.imagem,
            order: data.ordem,
            route: data.rota,
            description: data.description,
          });
        }
      },
    );

    return response;
  }
}
