import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

@injectable()
export class HomeListUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute() {
    const result = await connection.raw(`
      SELECT * FROM HOME INNER JOIN HOME_TIPO HT ON HOME.id_tipo = HT.id_tipo WHERE status = 1 ORDER BY ordem
    `);

    return result.map(value => {
      return {
        ...value,
        id_tipo: value.id_tipo[0],
      };
    });
  }
}
