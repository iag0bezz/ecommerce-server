import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { HomeListUseCase } from './HomeListUseCase';

export class HomeListController {
  async handle(request: Request, response: Response): Promise<Response> {
    const homeListUseCase = container.resolve(HomeListUseCase);

    const data = await homeListUseCase.execute();

    return response.json(data);
  }
}
