import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

interface IRequest {
  cod_conta: number;
}

@injectable()
export class PaymentListCardUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ cod_conta }: IRequest) {
    const response = await connection.raw(`
      SELECT 
        CP.*,
        CPC.card_number,
        CPC.token,
        CPC.label,
        CPC.[default]
      FROM CONTA_PAGAMENTO CP
        INNER JOIN CONTA_PAGAMENTO_CARTAO CPC
          ON CPC.cod_maxipago = CP.cod_maxipago
      WHERE
        CP.cod_conta = '${cod_conta}'
    `);

    return response.map(value => {
      return {
        ...value,
        default: value.default > 0,
      };
    });
  }
}
