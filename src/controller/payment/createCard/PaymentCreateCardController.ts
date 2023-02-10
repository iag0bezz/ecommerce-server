import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IPaymentCreateCardDTO } from './dto/IPaymentCreateCardDTO';
import { PaymentCreateCardUseCase } from './PaymentCreateCardUseCase';

export class PaymentCreateCardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const paymentCreateCardUseCase = container.resolve(
      PaymentCreateCardUseCase,
    );

    const data = await paymentCreateCardUseCase.execute({
      account_id: 31,
      data: request.body as IPaymentCreateCardDTO,
    });

    return response.json(data);
  }
}
