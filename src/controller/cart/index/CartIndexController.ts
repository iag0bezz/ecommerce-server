import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CartIndexUseCase } from './CartIndexUseCase';

export class CartIndexController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user } = request;

    const cartIndexUseCase = container.resolve(CartIndexUseCase);

    const data = await cartIndexUseCase.execute({
      cod_carrinho: request.body.cod_carrinho ?? undefined,
      cod_conta: user ? user.id : -1,
    });

    return response.json(data);
  }
}
