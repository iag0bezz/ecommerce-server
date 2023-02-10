import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { PaymentCreateCheckoutUseCase } from './PaymentCreateCheckoutUseCase';

export class PaymentCreateCheckoutController {
  async handle(request: Request, response: Response): Promise<Response> {
    const paymentCreateCheckoutUseCase = container.resolve(
      PaymentCreateCheckoutUseCase,
    );

    const data = await paymentCreateCheckoutUseCase.execute({
      account_id: 31,
      ...request.body,
    });

    return response.json(data);
  }
}
