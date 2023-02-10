import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IProductAllDTO } from './dto/IProductAllDTO';
import { ProductAllUseCase } from './ProductAllUseCase';

export class ProductAllController {
  async handle(request: Request, response: Response): Promise<Response> {
    const body = request.body as IProductAllDTO;

    const productAllUseCase = container.resolve(ProductAllUseCase);

    const data = await productAllUseCase.execute({
      ...body,
      account_id: request.user ? request.user.id : -1,
    });

    return response.json(data);
  }
}
