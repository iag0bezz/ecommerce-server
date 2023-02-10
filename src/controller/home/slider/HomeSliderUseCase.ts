import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

@injectable()
export class HomeSliderUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute() {
    const result = await connection.raw(`
      SELECT * FROM HOME WHERE id_tipo = 1 AND status = 1
    `);

    return result;
  }
}
