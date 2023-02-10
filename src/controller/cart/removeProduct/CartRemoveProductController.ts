import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CartRemoveProductUseCase } from './CartRemoveProductUseCase';

export class CartRemoveProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const cartRemoveProductUseCase = container.resolve(
      CartRemoveProductUseCase,
    );

    const data = await cartRemoveProductUseCase.execute({
      cod_carrinho: request.body.cod_carrinho,
      cod_conta: request.user ? request.user.id : -1,
      cod_produto: request.body.cod_produto,
    });

    return response.json(data);
  }
}
