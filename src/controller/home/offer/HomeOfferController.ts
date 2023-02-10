import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IHomeOfferDTO } from './dto/IHomeOfferDTO';
import { HomeOfferUseCase } from './HomeOfferUseCase';

export class HomeOfferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const body = request.body as IHomeOfferDTO;

    const homeOfferUseCase = container.resolve(HomeOfferUseCase);

    const data = await homeOfferUseCase.execute(body);

    return response.json(data);
  }
}
