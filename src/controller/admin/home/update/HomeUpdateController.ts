import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { HomeUpdateUseCase } from './HomeUpdateUseCase';

export class HomeUpdateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const homeUpdateUseCase = container.resolve(HomeUpdateUseCase);

    await homeUpdateUseCase.execute({
      ...request.body,
    });

    return response.json();
  }
}
