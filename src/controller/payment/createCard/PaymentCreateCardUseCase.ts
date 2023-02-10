import maxiPago from '@config/payment';
import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

import { IPaymentCreateCardDTO } from './dto/IPaymentCreateCardDTO';

type IRequest = {
  account_id: number;
  data: IPaymentCreateCardDTO;
};

interface IResponse {
  token: string;
  credit_card: string;
  default: boolean;
  label?: string;
}

@injectable()
export class PaymentCreateCardUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ account_id, data }: IRequest): Promise<IResponse> {
    const result = await connection.raw(`
      SELECT * FROM CONTA_PAGAMENTO WHERE cod_conta = '${account_id}'
    `);

    if (result.length <= 0) {
      throw new HttpError('payment/create-card.invalid-payment-client');
    }

    const response = await maxiPago.addCard({
      customerId: data.customer_id,
      creditCardNumber: data.credit_card,
      expirationMonth: data.expiration_month,
      expirationYear: data.expiration_year,
      // billing details
      billingName: data.billing.name,
      billingAddress1: data.billing.address,
      billingAddress2: data.billing.complement,
      billingCity: data.billing.city,
      billingState: data.billing.state,
      billingZip: data.billing.zip,
      billingCountry: data.billing.country,
      billingPhone: data.billing.phone,
      billingEmail: data.billing.email,
    });

    const card_result = await connection.raw(`
      SELECT * FROM CONTA_PAGAMENTO_CARTAO WHERE token = '${response.result.token}'
    `);

    if (card_result.length > 0) {
      throw new HttpError('payment/create-card.card-already-exists');
    }

    await connection.raw(
      `
        INSERT INTO CONTA_PAGAMENTO_CARTAO 
          ("cod_maxipago", "card_number", "token", "label")
          VALUES
          (:cod_maxipago, :card_number, :token, :label)
      `,
      {
        cod_maxipago: result[0].cod_maxipago,
        card_number: data.credit_card.substring(12, 16),
        token: response.result.token,
        label: data.label,
      },
    );

    return {
      token: response.result.token,
      label: data.label,
      credit_card: data.credit_card.substring(12, 16),
      default: true,
    };
  }
}
