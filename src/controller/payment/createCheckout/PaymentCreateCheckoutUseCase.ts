import { connection } from 'database';
import { container, inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { IPaymentProvider } from '@shared/container/provider/payment/IPaymentProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  account_id: number;
  cod_carrinho: string;
  operation: 'pix' | 'maxiPago';
}

@injectable()
export class PaymentCreateCheckoutUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ account_id, cod_carrinho, operation }: IRequest) {
    if (operation !== 'pix' && operation !== 'maxiPago') {
      throw new HttpError('payment/create-checkout.invalid-operation');
    }

    const carrinho = await connection.raw(`
      SELECT
        *
      FROM
        CARRINHO C

      INNER JOIN CARRINHO_PRODUTO CP
        ON CP.cod_carrinho = C.cod_carrinho

      WHERE
        C.cod_carrinho = '${cod_carrinho}'
        AND
        C.cod_conta = '${account_id}'
        AND
        C.status = 'A'
    `);

    if (carrinho.length <= 0) {
      throw new HttpError('payment/create-checkout.invalid-cart-items');
    }

    /*
      Create container to manage payment checkouts like Pix and maxiPago
    */
    const paymentProvider = container.resolve<IPaymentProvider>(
      `${operation}PaymentProvider`,
    );

    const result = await paymentProvider.checkout();

    return {
      result,
      carrinho,
    };
  }
}
