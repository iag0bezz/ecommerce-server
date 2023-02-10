import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IProductOfferDTO } from './dto/IProductOfferDTO';
import { ProductOfferUseCase } from './ProductOfferUseCase';

export class ProductOfferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const body = request.body as IProductOfferDTO;

    const productOfferUseCase = container.resolve(ProductOfferUseCase);

    const data = await productOfferUseCase.execute({
      ...body,
      account_id: request.user ? request.user.id : -1,
    });

    return response.json(data);
  }
}
