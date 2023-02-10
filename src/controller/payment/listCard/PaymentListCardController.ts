import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { PaymentListCardUseCase } from './PaymentListCardUseCase';

export class PaymentListCardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const paymentListCardUseCase = container.resolve(PaymentListCardUseCase);

    const data = await paymentListCardUseCase.execute({
      cod_conta: 31,
    });

    return response.json(data);
  }
}
