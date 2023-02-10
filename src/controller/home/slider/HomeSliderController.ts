import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { HomeSliderUseCase } from './HomeSliderUseCase';

export class HomeSliderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const homeSliderUseCase = container.resolve(HomeSliderUseCase);

    const data = await homeSliderUseCase.execute();

    return response.json(data);
  }
}
