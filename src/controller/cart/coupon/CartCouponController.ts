import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CartCouponUseCase } from './CartCouponUseCase';

export class CartCouponController {
  async handle(request: Request, response: Response): Promise<Response> {

    const cartCouponUseCase = container.resolve(
      CartCouponUseCase
    );

    const data = await cartCouponUseCase.execute({
      value: undefined,
    });

    return response.json(data);
  }
}