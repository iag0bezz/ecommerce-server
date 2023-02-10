import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProductFindUseCase } from './ProductFindUseCase';

export class ProductFindController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const productFindUseCase = container.resolve(ProductFindUseCase);

    const data = await productFindUseCase.execute({
      id,
    });

    return response.json(data);
  }
}
