import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IPaymentCreateClientDTO } from './dto/IPaymentCreateClientDTO';
import { PaymentCreateClientUseCase } from './PaymentCreateClientUseCase';

export class PaymentCreateClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const paymentCreateClientUseCase = container.resolve(
      PaymentCreateClientUseCase,
    );

    const data = await paymentCreateClientUseCase.execute({
      account_id: 31,
      data: request.body as IPaymentCreateClientDTO,
    });

    return response.json(data);
  }
}
