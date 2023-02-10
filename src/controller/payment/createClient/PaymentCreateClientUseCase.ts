import maxiPago from 'config/payment';
import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

import { IPaymentCreateClientDTO } from './dto/IPaymentCreateClientDTO';

type IRequest = {
  account_id: number;
  data: IPaymentCreateClientDTO;
};

interface IResponse {
  customer_id: string;
}

@injectable()
export class PaymentCreateClientUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ account_id, data }: IRequest): Promise<IResponse> {
    const result = await connection.raw(
      `SELECT * FROM CONTA_PAGAMENTO WHERE cod_conta = '${account_id}'`,
    );

    if (result.length > 0) {
      throw new HttpError('payment/create-client.customer-already.exists');
    }

    const response = await maxiPago.createCustomer({
      customerIdExt: String(account_id),
      firstName: data.name,
      lastName: data.last_name,
      address1: data.address,
      address2: data.complement,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      phone: data.phone,
      email: data.email,
      dob: data.dob,
      sex: data.sex,
    });

    await connection.raw(`
      INSERT INTO CONTA_PAGAMENTO ("cod_conta", "cod_maxipago") VALUES (${account_id}, '${response.result.customerId}')
    `);

    return {
      customer_id: response.result.customerId,
    };
  }
}
