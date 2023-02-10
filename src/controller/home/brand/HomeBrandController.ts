import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { HomeBrandUseCase } from './HomeBrandUseCase';

export class HomeBrandController {
  async handle(request: Request, response: Response): Promise<Response> {
    const homeBrandUseCase = container.resolve(HomeBrandUseCase);

    const data = await homeBrandUseCase.execute(request.body);

    return response.json(data);
  }
}
