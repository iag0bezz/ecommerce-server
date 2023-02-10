import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CartControlProductUseCase } from './CartControlProductUseCase';

export class CartControlProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const cartProductControlUseCase = container.resolve(
      CartControlProductUseCase,
    );

    const data = await cartProductControlUseCase.execute({
      cod_conta: request.user ? request.user.id : undefined,
      ...request.body,
    });

    return response.json(data);
  }
}
